#!/usr/bin/env python3
"""퍼블리싱 HTML 조각을 JSX 로 바꾼다 (이관 작업용 보조 도구).

사용: python3 scripts/html-to-jsx.py <원본.html> <시작행> <끝행> [--page-dir member]
  - 지정한 행 범위(1부터, 끝행 포함)의 HTML 을 JSX 로 출력한다.
  - class→className, for→htmlFor, style 문자열→객체, 주석→{/* */}
  - ../resources/... → /resources/..., *.html 링크 → Next.js 경로
  - 결과는 출발점일 뿐이다. 동작(onClick, 상태)은 손으로 붙인다.
"""
import argparse
import posixpath
import re
from html.parser import HTMLParser

VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}
INLINE = {"a", "abbr", "b", "br", "button", "code", "em", "i", "img", "input", "label", "select",
          "small", "span", "strong", "sub", "sup", "textarea", "u"}
ATTR = {"class": "className", "for": "htmlFor", "maxlength": "maxLength", "readonly": "readOnly",
        "tabindex": "tabIndex", "colspan": "colSpan", "rowspan": "rowSpan", "autocomplete": "autoComplete"}
BOOL = {"required", "readonly", "checked", "disabled", "selected", "multiple", "autofocus"}
# 파일명이 바뀐 페이지 (next.config.ts 의 renamedPages 와 같은 내용)
RENAMED = {
    "member/signup-step2": "/member/signup/step2",
    "member/signup-step3": "/member/signup/step3",
    "event/event": "/event",
    "index": "/",
}


class Node:
    def __init__(self, tag, attrs=None, text=None, comment=None):
        self.tag, self.attrs, self.text, self.comment = tag, attrs or [], text, comment
        self.children = []


class Builder(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node("#root")
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs)
        self.stack[-1].children.append(node)
        if tag not in VOID:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.stack[-1].children.append(Node(tag, attrs))

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                return

    def handle_data(self, data):
        # "<별표>" 처럼 글자 속 꺾쇠에서 텍스트가 쪼개져 들어오므로 앞 텍스트와 합친다
        kids = self.stack[-1].children
        if kids and kids[-1].tag == "#text":
            kids[-1].text += data
        else:
            kids.append(Node("#text", text=data))

    def handle_comment(self, data):
        self.stack[-1].children.append(Node("#comment", comment=data.strip()))


def rewrite_url(value, page_dir):
    if re.match(r"^(https?:|tel:|mailto:|#|javascript:|//)", value):
        return "#" if value.startswith("javascript:") else value
    path, _, hash_ = value.partition("#")
    resolved = posixpath.normpath(posixpath.join("/" + page_dir, path)).lstrip("/")
    if resolved.startswith("resources/"):
        return "/" + resolved
    if resolved.endswith(".html"):
        key = resolved[:-5]
        route = RENAMED.get(key, "/" + key)
        return route + ("#" + hash_ if hash_ else "")
    return value


def style_obj(css):
    parts = []
    for decl in filter(None, (d.strip() for d in css.split(";"))):
        prop, _, val = decl.partition(":")
        prop = re.sub(r"-([a-z])", lambda m: m.group(1).upper(), prop.strip())
        val = val.strip()
        if "!important" in val:
            parts.append(f'/* TODO !important */ {prop}: "{val.replace("!important", "").strip()}"')
        else:
            parts.append(f'{prop}: "{val}"')
    return "{{ " + ", ".join(parts) + " }}"


def jsx_attrs(node, page_dir):
    out = []
    for name, value in node.attrs:
        if name == "target" and value == "_blank":
            continue  # 내부 링크는 같은 탭 이동 (외부 링크는 손으로 확인)
        jname = ATTR.get(name, name)
        # 상태 없이 옮긴 폼 요소는 초기값으로만 둔다 (React 제어 컴포넌트 경고 방지)
        if name == "checked":
            jname = "defaultChecked"
        if name == "value" and node.tag in ("input", "textarea") and dict(node.attrs).get("type") not in (
            "checkbox", "radio", "hidden", "button", "submit", "reset",
        ):
            jname = "defaultValue"
        if name in BOOL:
            out.append(jname)
        elif name == "style":
            out.append(f"style={style_obj(value or '')}")
        elif name in ("rows", "cols", "maxlength", "colspan", "rowspan", "tabindex", "size") and (value or "").isdigit():
            out.append(f"{jname}={{{value}}}")
        elif name in ("href", "src"):
            out.append(f'{jname}="{rewrite_url(value or "", page_dir)}"')
        else:
            out.append(f'{jname}="{value or ""}"')
    return (" " + " ".join(out)) if out else ""


def escape_text(text):
    text = (text.replace("&", "&amp;").replace("{", "&#123;").replace("}", "&#125;")
            .replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;").replace("'", "&apos;"))
    return text.replace(" ", "&nbsp;")


def is_inline(node):
    return node.tag in INLINE or node.tag == "#text"


def render(node, page_dir, indent):
    pad = "  " * indent
    lines = []
    kids = [k for k in node.children]
    for i, kid in enumerate(kids):
        if kid.tag == "#comment":
            lines.append(f"{pad}{{/* {kid.comment} */}}")
        elif kid.tag == "#text":
            collapsed = re.sub(r"[ \t\r\n]+", " ", kid.text)
            prev = kids[i - 1] if i > 0 else None
            nxt = kids[i + 1] if i + 1 < len(kids) else None
            # str.strip() 은 nbsp 까지 지우므로 일반 공백만 다룬다
            if collapsed.strip(" ") == "":
                # 인라인 요소 사이의 공백만 살린다
                if collapsed and prev is not None and nxt is not None and is_inline(prev) and is_inline(nxt):
                    lines.append(f'{pad}{{" "}}')
                continue
            body = escape_text(collapsed.strip(" "))
            lead = collapsed.startswith(" ") and prev is not None and is_inline(prev)
            trail = collapsed.endswith(" ") and nxt is not None and is_inline(nxt)
            lines.append(f'{pad}{"{" + chr(34) + " " + chr(34) + "}" if lead else ""}{body}{"{" + chr(34) + " " + chr(34) + "}" if trail else ""}')
        else:
            attrs = jsx_attrs(kid, page_dir)
            if kid.tag in VOID or not kid.children:
                lines.append(f"{pad}<{kid.tag}{attrs} />" if kid.tag in VOID else f"{pad}<{kid.tag}{attrs}></{kid.tag}>")
            else:
                inner = render(kid, page_dir, indent + 1)
                lines.append(f"{pad}<{kid.tag}{attrs}>")
                lines.extend(inner)
                lines.append(f"{pad}</{kid.tag}>")
    return lines


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("file")
    ap.add_argument("start", type=int)
    ap.add_argument("end", type=int)
    ap.add_argument("--page-dir", default="")
    ap.add_argument("--indent", type=int, default=0)
    args = ap.parse_args()
    with open(args.file, encoding="utf-8") as f:
        src = "".join(f.readlines()[args.start - 1:args.end])
    b = Builder()
    b.feed(src)
    print("\n".join(render(b.root, args.page_dir, args.indent)))


if __name__ == "__main__":
    main()
