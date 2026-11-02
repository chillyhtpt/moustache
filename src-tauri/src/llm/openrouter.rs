//! OpenRouter chat completions (`POST https://openrouter.ai/api/v1/chat/completions`).

use async_trait::async_trait;
use serde_json::{Value, json};

use super::http::send_json;
use super::{LlmError, LlmProvider, LlmProviderId, LlmRequest, LlmResponse};
use crate::t;

pub const BASE_URL: &str = "https://openrouter.ai/api/v1";

fn auth_token(raw_key: &str) -> String {
    let trimmed = raw_key.trim().trim_matches('"').trim_matches('\'');
    trimmed.strip_prefix("Bearer ").unwrap_or(trimmed).trim().to_owned()
}

pub struct OpenRouter {
    client: reqwest::Client,
    base_url: String,
    key: String,
    model: String,
}

impl OpenRouter {
    pub fn new(client: reqwest::Client, base_url: &str, key: String, model: String) -> Self {
        Self {
            client,
            base_url: base_url.trim_end_matches('/').to_owned(),
            key,
            model,
        }
    }
}

pub fn body(model: &str, request: &LlmRequest) -> Value {
    let mut messages = vec![json!({"role": "system", "content": request.system})];
    messages.extend(
        request
            .messages
            .iter()
            .map(|message| json!({"role": message.role.as_str(), "content": message.content})),
    );
    json!({
        "model": model,
        "messages": messages,
        "max_tokens": request.max_output_tokens,
        "stream": false,
    })
}

pub fn parse(response: &Value) -> Result<LlmResponse, LlmError> {
    let content = response["choices"][0]["message"]["content"]
        .as_str()
        .ok_or_else(|| LlmError::Failed(t!("error.llm.noMessage")))?;
    // Strip reasoning thoughts if emitted by deepseek-r1 or similar reasoning models
    let clean = if let Some(end_idx) = content.rfind("</think>") {
        content[end_idx + "</think>".len()..].trim()
    } else {
        content.trim()
    };
    Ok(LlmResponse { text: clean.into() })
}

#[async_trait]
impl LlmProvider for OpenRouter {
    fn id(&self) -> LlmProviderId {
        LlmProviderId::OpenRouter
    }

    fn model(&self) -> &str {
        &self.model
    }

    async fn complete(&self, request: &LlmRequest) -> Result<LlmResponse, LlmError> {
        let token = auth_token(&self.key);
        let response = send_json(
            self.client
                .post(format!("{}/chat/completions", self.base_url))
                .header(reqwest::header::AUTHORIZATION, format!("Bearer {token}"))
                .header("HTTP-Referer", "https://github.com/chillyhtpt/moustache")
                .header("X-Title", "Moustache")
                .header(reqwest::header::CONTENT_TYPE, "application/json")
                .header(reqwest::header::USER_AGENT, "Moustache/1.1.5")
                .json(&body(&self.model, request)),
        )
        .await?;
        parse(&response)
    }

    async fn warm_up(&self) {
        let token = auth_token(&self.key);
        let _ = self
            .client
            .get(format!("{}/models", self.base_url))
            .header(reqwest::header::AUTHORIZATION, format!("Bearer {token}"))
            .header("HTTP-Referer", "https://github.com/chillyhtpt/moustache")
            .header("X-Title", "Moustache")
            .header(reqwest::header::USER_AGENT, "Moustache/1.1.5")
            .send()
            .await;
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn builds_an_openrouter_chat_request() {
        let request = LlmRequest::single("Clean up.".into(), "um hi".into(), 256);
        assert_eq!(
            body("meta-llama/llama-3.3-70b-instruct:free", &request),
            json!({
                "model": "meta-llama/llama-3.3-70b-instruct:free",
                "messages": [
                    {"role": "system", "content": "Clean up."},
                    {"role": "user", "content": "um hi"}
                ],
                "max_tokens": 256,
                "stream": false
            })
        );
    }

    #[test]
    fn reads_the_first_choice_and_strips_think() {
        let response = json!({
            "id": "gen-1",
            "choices": [{"index": 0, "message": {"role": "assistant", "content": "Hello!"}}],
        });
        assert_eq!(parse(&response).unwrap().text, "Hello!");

        let think_response = json!({
            "choices": [{"index": 0, "message": {"role": "assistant", "content": "<think>Wait...</think> Hello world!"}}],
        });
        assert_eq!(parse(&think_response).unwrap().text, "Hello world!");
    }

    #[test]
    fn sanitizes_keys() {
        assert_eq!(auth_token("  sk-or-v1-abc  "), "sk-or-v1-abc");
        assert_eq!(auth_token("Bearer sk-or-v1-xyz"), "sk-or-v1-xyz");
    }
}
