---
name: enhance-solutions
description: _solutions/ MDX 파일의 문제 설명 및 풀이 품질을 개선합니다.
disable-model-invocation: true
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, WebSearch, WebFetch, AskUserQuestion
argument-hint: "[--grade=C|B|A|all] [--batch=10] [--from=boj-NNNN]"
---

# 솔루션 MDX 품질 보강

대상: `$ARGUMENTS`

## 0단계: 인자 파싱

`$ARGUMENTS`에서 다음을 추출합니다:

- **--grade**: 대상 등급 (C, B, A, all). 기본값: `C`
- **--batch**: 배치 크기. 기본값: `10`
- **--from**: 특정 slug부터 재개 (예: `boj-1234`)

## 1단계: 대상 파일 수집

### 품질 등급 판별 기준

**C-grade** (보일러플레이트 풀이):
풀이 섹션에 다음 문구 중 하나가 포함된 파일:

- "문제의 조건을 그대로 구현한다"
- "문제의 조건에 맞게 풀이한다"
- "가능한 모든 경우를 탐색하여 답을 구한다"

**B-grade** (알고리즘명만 언급):
풀이 섹션이 2줄 이하이고 C-grade가 아닌 파일

**A-grade** (비교적 설명 있으나 보강 가능):
위 두 가지에 해당하지 않는 파일

### 이미 처리된 파일 제외

frontmatter에 `enhanced: true`가 있는 파일은 스킵합니다.

### 검색 방법

```bash
# C-grade 검색 예시
grep -rl "문제의 조건을 그대로 구현한다" _solutions/*.mdx
grep -rl "문제의 조건에 맞게 풀이한다" _solutions/*.mdx
grep -rl "가능한 모든 경우를 탐색하여 답을 구한다" _solutions/*.mdx

# enhanced 제외
grep -rL "enhanced: true" _solutions/*.mdx
```

C-grade와 enhanced 제외를 교차하여 최종 대상 목록을 만듭니다.

`--from` 인자가 있으면 해당 slug 이후의 파일만 포함합니다 (파일명 정렬 기준).

## 2단계: 배치 목록 사용자 확인

대상 파일 중 `--batch` 크기만큼 잘라 사용자에게 보여줍니다:

```
=== 보강 대상 (배치 1/N) ===
총 대상: {total}개 | 이번 배치: {batch_size}개

| # | 파일 | 문제번호 | 문제이름 | 현재 풀이 |
|---|------|----------|----------|-----------|
| 1 | 20250715-boj-5586.mdx | 5586 | JOI와 IOI | 문제의 조건을 그대로 구현한다 |
| 2 | ... | ... | ... | ... |

계속 진행하시겠습니까?
```

AskUserQuestion으로 사용자 승인을 받습니다.

## 3단계: 파일별 처리 (핵심)

각 파일에 대해 순서대로 수행합니다:

### 3-1. 파일 읽기

Read로 현재 MDX 전체를 읽고, frontmatter / 풀이 섹션 / 코드 블록을 파악합니다.

### 3-2. 문제 정보 수집

**WebSearch 검색**:

```
백준 {number} {문제이름} 문제 입력 출력
```

검색 결과에서 블로그 또는 문제 설명이 있는 페이지를 WebFetch로 가져와:

- 문제 설명 (요약)
- 입력 형식
- 출력 형식
- 예제 입출력

을 추출합니다.

**solved.ac API로 메타데이터 보충** (필요 시):

```bash
curl -s "https://solved.ac/api/v3/problem/show?problemId={number}"
```

- 난이도, 태그 확인 및 보충

### 3-3. 코드 분석

코드 블록을 직접 읽고 알고리즘 로직을 파악합니다:

- 사용된 자료구조 (배열, Map, Set, 큐, 스택, 그래프 등)
- 함수명, 변수명, 주석에서 알고리즘 추론
- 핵심 로직의 동작 원리 이해
- 시간/공간 복잡도 재검증

### 3-4. MDX 업데이트

Edit 도구로 기존 파일을 수정합니다.

**절대 규칙: 코드 블록은 수정하지 않습니다.**

#### 수정 대상 1: 문제 섹션 보강

**Before:**

```mdx
## 문제

[BOJ 5586 - JOI와 IOI](https://www.acmicpc.net/problem/5586)
```

**After:**

```mdx
## 문제

[BOJ 5586 - JOI와 IOI](https://www.acmicpc.net/problem/5586)

알파벳 대문자로만 이루어진 문자열이 주어질 때, "JOI"와 "IOI"가 각각 몇 번 포함되어 있는지 구하라.

### 입력

알파벳 대문자로만 이루어진 문자열이 한 줄로 주어진다 (길이 1 이상 10,000 이하).

### 출력

첫째 줄에 "JOI"의 개수, 둘째 줄에 "IOI"의 개수를 출력한다.

### 예제

| 입력      | 출력    |
| --------- | ------- |
| `JOIOIOI` | `1` `2` |
```

#### 수정 대상 2: 풀이 섹션 보강

**Before:**

```mdx
## 풀이

문제의 조건을 그대로 구현한다.
```

**After:**

```mdx
## 풀이

문자열을 처음부터 끝까지 순회하며 길이 3인 부분 문자열을 확인하여 "JOI"와 "IOI" 출현 횟수를 센다.

1. 인덱스 0부터 len(s)-3까지 반복하며 s[i:i+3] 부분 문자열을 추출한다
2. 부분 문자열이 "JOI"이면 joi_count를 증가시킨다
3. 부분 문자열이 "IOI"이면 ioi_count를 증가시킨다
4. 최종 카운트를 순서대로 출력한다

**핵심 아이디어**: 슬라이딩 윈도우 방식으로 고정 길이(3)의 부분 문자열을 확인하므로 O(N) 시간에 해결된다.
```

#### 수정 대상 3: frontmatter에 enhanced 추가

```yaml
---
title: "BOJ 5586 - JOI와 IOI"
...
enhanced: true
---
```

### 3-5. 복잡도 검증

코드를 기반으로 기존 복잡도가 정확한지 확인합니다. 틀린 경우 수정합니다.

## 4단계: 배치 완료 보고

```
=== 배치 처리 완료 ===
처리된 파일: {count}개
남은 파일: {remaining}개

처리 목록:
  - 20250715-boj-5586.mdx (C → enhanced)
  - 20250715-boj-5534.mdx (C → enhanced)
  ...

다음 배치를 계속 진행하시겠습니까?
```

AskUserQuestion으로 확인합니다.

## 5단계: 커밋 (선택)

사용자가 요청하면 커밋합니다. 커밋 메시지 형식:

```
docs: solutions MDX 품질 보강 ({grade}-grade, {count}개)
```

## 강화된 MDX 전체 템플릿

보강 후 전체 구조:

````mdx
---
title: "BOJ {number} - {title}"
date: "{date}"
description: "{description}"
tags: ["{tag1}", "{tag2}"]
platform: "boj"
problem_number: "{number}"
problem_url: "https://www.acmicpc.net/problem/{number}"
difficulty: "{difficulty}"
language: "{language}"
enhanced: true
---

## 문제

[BOJ {number} - {title}](https://www.acmicpc.net/problem/{number})

{문제 설명 요약 - 핵심만 1-3줄}

### 입력

{입력 형식 설명}

### 출력

{출력 형식 설명}

### 예제

| 입력         | 출력         |
| ------------ | ------------ |
| `{예제입력}` | `{예제출력}` |

## 풀이

{접근 방식과 핵심 아이디어 설명 - 1-2줄 요약}

1. {단계별 풀이 설명}
2. {단계별 풀이 설명}
3. {단계별 풀이 설명}

**핵심 아이디어**: {왜 이 접근이 유효한지, 시간 제한 내에 가능한 이유 등}

## 코드

\```{language}
{기존 코드 - 절대 수정하지 않음}
\```

## 복잡도

- 시간: O(...)
- 공간: O(...)
````

## 작성 규칙

1. **문제 설명은 원문 기반 요약**: 핵심만 간결하게 작성 (저작권 고려, 원문 복붙 금지)
2. **풀이는 반드시 코드 분석 기반**: 코드를 읽고 실제 구현을 기반으로 설명 작성
3. **코드 블록은 절대 수정 금지**: 기존 코드를 그대로 유지
4. **복잡도는 코드 기반 재검증**: 기존 복잡도가 틀리면 수정
5. **수학 공식은 텍스트 표현**: LaTeX 미사용 (예: "C(64,3)" 형태)
6. **이미지가 필요한 문제**: 텍스트로 설명
7. **한국어 작성**: 모든 설명은 한국어로
8. **예제 테이블의 여러 줄 입력**: 각 줄을 공백으로 구분하여 인라인 코드 내 표현 (예: `` `7 7` `2 0 0 0 1 1 0` `...` ``)
9. **MDX 파싱 안전성**: 코드 블록 외부에서 `<`, `>`, `{`, `}` 문자는 반드시 백틱(`` ` ``)으로 감싸거나 `\`로 이스케이프 (예: `HashSet<Character>` → `` `HashSet<Character>` ``)

## 에러 처리

| 상황                              | 대응                                                          |
| --------------------------------- | ------------------------------------------------------------- |
| WebSearch 실패                    | 코드 분석만으로 풀이 작성, 문제 설명은 blockquote 요약만 추가 |
| solved.ac API 실패                | 기존 frontmatter 유지                                         |
| MDX 파싱 오류                     | 해당 파일 스킵 후 보고                                        |
| 문제 정보를 충분히 수집할 수 없음 | 코드에서 추론 가능한 범위까지만 작성                          |

## 진행 추적

```bash
# 처리 완료 파일 수
grep -rl "enhanced: true" _solutions/*.mdx | wc -l

# 미처리 파일 수
grep -rL "enhanced: true" _solutions/*.mdx | wc -l
```
