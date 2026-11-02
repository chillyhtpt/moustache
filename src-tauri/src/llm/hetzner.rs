//! Hetzner chat completions (OpenAI-compatible, `POST /v1/chat/completions`).

use async_trait::async_trait;
use serde_json::{Value, json};

use super::http::send_json;
use super::{LlmError, LlmProvider, LlmProviderId, LlmRequest, LlmResponse};
use crate::t;

pub const BASE_URL: &str = "https://inference.hetzner.com/api/v1";

pub struct Hetzner {
    client: reqwest::Client,
    base_url: String,
    key: String,
    model: String,
}

impl Hetzner {
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
    let text = response["choices"][0]["message"]["content"]
        .as_str()
        .ok_or_else(|| LlmError::Failed(t!("error.llm.noMessage")))?;
    Ok(LlmResponse { text: text.into() })
}

#[async_trait]
impl LlmProvider for Hetzner {
    fn id(&self) -> LlmProviderId {
        LlmProviderId::Hetzner
    }

    fn model(&self) -> &str {
        &self.model
    }

    async fn complete(&self, request: &LlmRequest) -> Result<LlmResponse, LlmError> {
        let response = send_json(
            self.client
                .post(format!("{}/chat/completions", self.base_url))
                .bearer_auth(&self.key)
                .json(&body(&self.model, request)),
        )
        .await?;
        parse(&response)
    }

    async fn warm_up(&self) {
        let _ = self.client.head(&self.base_url).send().await;
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn builds_a_hetzner_chat_request() {
        let request = LlmRequest::single("Clean up.".into(), "um hi".into(), 256);
        assert_eq!(
            body("Qwen/Qwen2.5-72B-Instruct", &request),
            json!({
                "model": "Qwen/Qwen2.5-72B-Instruct",
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
    fn reads_the_first_choice() {
        let response = json!({
            "id": "chatcmpl-1", "object": "chat.completion", "model": "Qwen/Qwen2.5-72B-Instruct",
            "choices": [{"index": 0, "message": {"role": "assistant", "content": "Hi."}, "finish_reason": "stop"}],
            "usage": {"prompt_tokens": 20, "completion_tokens": 3, "total_tokens": 23}
        });
        assert_eq!(parse(&response).unwrap().text, "Hi.");
        assert!(parse(&json!({"choices": []})).is_err());
    }
}
