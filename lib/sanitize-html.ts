const EVENT_HANDLER_ATTR_REGEX = /\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;
const SCRIPT_STYLE_IFRAME_REGEX =
  /<(script|style|iframe|object|embed|link|meta)[^>]*>[\s\S]*?<\/\1>/gi;
const SELF_CLOSING_DANGEROUS_TAG_REGEX = /<(script|style|iframe|object|embed|link|meta)[^>]*\/?\s*>/gi;
const JS_PROTOCOL_REGEX = /(href|src)\s*=\s*(["'])\s*javascript:[^"']*\2/gi;

export function sanitizeHtml(html: string) {
  return html
    .replace(SCRIPT_STYLE_IFRAME_REGEX, "")
    .replace(SELF_CLOSING_DANGEROUS_TAG_REGEX, "")
    .replace(EVENT_HANDLER_ATTR_REGEX, "")
    .replace(JS_PROTOCOL_REGEX, '$1="#"');
}
