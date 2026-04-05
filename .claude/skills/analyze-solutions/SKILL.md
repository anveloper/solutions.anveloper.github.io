---
name: analyze-solutions
description: 알고리즘 풀이 레포지토리의 커밋을 분석하여 _solutions/ 에 MDX 콘텐츠를 자동 생성합니다.
disable-model-invocation: true
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, Task, WebFetch, WebSearch, AskUserQuestion
argument-hint: "<레포지토리 경로 또는 GitHub URL> [--after=YYYY-MM-DD] [--before=YYYY-MM-DD]"
---

# 알고리즘 풀이 분석 및 MDX 생성

분석 대상: `$ARGUMENTS`

## 0단계: 인자 파싱

`$ARGUMENTS`에서 다음을 추출합니다:

- **레포지토리 경로**: 로컬 경로 또는 GitHub URL
- **--after**: 시작 날짜 (선택, 기본값: 없음)
- **--before**: 종료 날짜 (선택, 기본값: 없음)

### GitHub URL 판별 규칙

다음 패턴 중 하나에 해당하면 GitHub URL로 간주:

- `https://github.com/<owner>/<repo>`
- `github.com/<owner>/<repo>`
- `<owner>/<repo>` (슬래시 1개, 로컬 경로에 해당하는 파일/디렉토리가 없는 경우)

### GitHub URL인 경우

```bash
REPO_DIR=$(mktemp -d /tmp/analyze-solutions-XXXXXX)
gh repo clone <owner>/<repo> "$REPO_DIR"
```

### 로컬 경로인 경우

- 인자를 그대로 레포지토리 경로로 사용

> 이하 단계에서 `$REPO_PATH`는 위에서 결정된 실제 경로를 의미합니다.

## 1단계: 레포지토리 구조 자동 감지

```bash
ls -la $REPO_PATH
find $REPO_PATH -maxdepth 2 -type d -not -path '*/.git/*' | head -50
```

레포지토리 구조를 자동 감지합니다. 아래는 지원하는 파일명 패턴입니다:

### 패턴 A: `algorithm-{lang}/{category}/{platform}-{number}.{ext}`

```
algorithm-py/implementation/boj-1000.py
algorithm-cpp/greedy/boj-2839.cpp
algorithm-rust/string/boj-2391.rs
```

- 언어: 디렉토리명에서 추출 (`algorithm-py` → python)
- 카테고리: 서브디렉토리명 → 태그로 활용
- 문제 번호: 파일명에서 추출 (`boj-1000` → 1000)
- 대표 레포: **today-i-learned**

### 패턴 B: `day{NNN}/Day{N}BOJ{ID}{한글설명}.java`

```
day149/Day101BOJ10026적록색약DFS.java
day549/Day500BOJ2741N찍기.java
```

- 언어: java (고정)
- 카테고리: 파일명의 한글 설명에서 알고리즘 키워드 추출 (BFS, DFS, DP 등)
- 문제 번호: `BOJ` 뒤의 숫자 추출
- 대표 레포: **ASP_study**

### 패턴 C: `{NNN}/BOJ{number}.{ext}`

```
001/BOJ2557.cpp
003/BOJ10926.cpp
```

- 언어: 확장자에서 추출
- 카테고리: 없음 (solved.ac API로 보충)
- 문제 번호: `BOJ` 뒤의 숫자
- 대표 레포: **ASP.cpp**

### 패턴 D: `{dir}/{NNN}_BOJ{ID}.{ext}`

```
day001/001_BOJ1296.js
001/025_BOJ25206.py
```

- 언어: 확장자에서 추출
- 카테고리: 없음 (solved.ac API로 보충)
- 문제 번호: `BOJ` 뒤의 숫자
- 대표 레포: **ASP.js**, **ASP.py**

### 문제 번호 추출 정규식

모든 패턴에서 BOJ 문제 번호를 추출하는 통합 정규식:

```
파일명에서 boj[-_]?(\d+) (대소문자 무시) 매칭 → 문제 번호
```

### 언어 매핑

| 확장자 / 디렉토리         | language 값 |
| ------------------------- | ----------- |
| `.py`, `algorithm-py`     | python      |
| `.cpp`, `algorithm-cpp`   | cpp         |
| `.rs`, `algorithm-rust`   | rust        |
| `.java`, `algorithm-java` | java        |
| `.js`, `algorithm-js`     | javascript  |

### 카테고리 → 태그 매핑

디렉토리명 또는 파일명 키워드를 한국어 태그로 변환합니다:

| 키워드                                  | 태그                    |
| --------------------------------------- | ----------------------- |
| `implementation`                        | 구현                    |
| `mathematics`                           | 수학                    |
| `string`                                | 문자열                  |
| `brute-force`                           | 브루트포스              |
| `greedy`                                | 그리디                  |
| `dynamic-programming`, `DP`             | DP                      |
| `binary-search`                         | 이분 탐색               |
| `bfs`, `breath-first-search`            | BFS                     |
| `dfs`, `depth-first-search`             | DFS                     |
| `sort`                                  | 정렬                    |
| `stack`                                 | 스택                    |
| `hash`                                  | 해시                    |
| `graph`                                 | 그래프                  |
| `two-pointer`                           | 투 포인터               |
| `sliding-window`                        | 슬라이딩 윈도우         |
| `prefix-sum`                            | 누적 합                 |
| `euclidean`                             | 유클리드 호제법         |
| `eratosthenes`, `sieve-of-eratosthenes` | 에라토스테네스의 체     |
| `data-structure`                        | 자료구조                |
| `priority-queue`                        | 우선순위 큐             |
| `bitmasking`                            | 비트마스킹              |
| `ad-hoc`                                | 애드혹                  |
| 기타                                    | solved.ac API 태그 사용 |

## 2단계: 풀이 파일 수집

### 기간 필터가 있는 경우 (git log 기반)

```bash
git -C $REPO_PATH log \
  --after="$AFTER_DATE" --before="$BEFORE_DATE" \
  --name-only --pretty=format:"---COMMIT---%H %ai"
```

- 결과에서 풀이 파일만 필터링 (확장자: `.py`, `.cpp`, `.rs`, `.java`, `.js`)
- 커밋 날짜와 변경된 파일 목록을 매핑
- 동일 파일이 여러 커밋에서 변경된 경우, 최신 커밋 날짜 사용

### 기간 필터가 없는 경우 (전체 파일 스캔)

```bash
find $REPO_PATH -type f \( -name "*.py" -o -name "*.cpp" -o -name "*.rs" -o -name "*.java" -o -name "*.js" \) \
  -not -path '*/.git/*' -not -path '*/node_modules/*' -not -path '*/target/*' -not -path '*/.vscode/*' | sort
```

- 각 파일의 최신 커밋 날짜를 git log로 조회:
  ```bash
  git -C $REPO_PATH log -1 --format="%ai" -- "<filepath>"
  ```

## 3단계: 기존 MDX와 대조하여 중복 제거

```bash
ls _solutions/*.mdx 2>/dev/null
```

- slug 기준으로 중복 판별
- slug 생성 규칙: `boj-{number}` (예: `boj-1000`)
- **같은 문제를 여러 언어/레포에서 풀었을 경우**: 가장 먼저 발견된 풀이만 생성 (중복 방지)
  - 또는 사용자에게 어떤 언어 풀이를 사용할지 확인

## 4단계: 사용자 확인

분석 결과를 사용자에게 보여줍니다:

- 총 풀이 파일 수
- 새로 추가할 풀이 목록 (플랫폼, 문제 번호, 언어)
- 이미 존재하여 스킵하는 풀이 목록
- 같은 문제의 다중 언어 풀이가 있으면 어떤 언어를 사용할지 확인
- 계속 진행할지 확인

## 5단계: 배치 처리 (10개 단위)

각 문제에 대해 다음을 수행합니다:

### 5.1 솔루션 코드 읽기

감지된 구조에 맞는 경로에서 파일을 읽습니다.

### 5.2 문제 URL 결정

| 플랫폼      | URL 패턴                                             |
| ----------- | ---------------------------------------------------- |
| BOJ         | `https://www.acmicpc.net/problem/{number}`           |
| Programmers | WebSearch로 `programmers {문제명}` 검색하여 URL 확보 |

### 5.3 문제 정보 추출

BOJ 문제 정보는 solved.ac API를 우선 사용합니다:

```bash
curl -s "https://solved.ac/api/v3/problem/show?problemId={number}"
```

응답에서 추출:

- `titleKo`: 문제 제목 (한국어)
- `level`: 난이도 (숫자 → 티어 변환)
- `tags[].displayNames[].name` (ko): 알고리즘 분류 → 태그 보충

#### solved.ac 난이도 매핑

| level | 티어             |
| ----- | ---------------- |
| 0     | Unrated          |
| 1-5   | 브론즈 V ~ I     |
| 6-10  | 실버 V ~ I       |
| 11-15 | 골드 V ~ I       |
| 16-20 | 플래티넘 V ~ I   |
| 21-25 | 다이아몬드 V ~ I |
| 26-30 | 루비 V ~ I       |

API 실패 시 WebFetch로 문제 페이지에서 제목만 추출합니다.

### 5.4 MDX 파일 생성

파일명: `_solutions/YYYYMMDD-boj-{number}.mdx`

#### Frontmatter

```yaml
---
title: "BOJ 1000 - A+B"
date: "2026-02-18"
description: "두 정수를 입력받아 합을 출력하는 기본 입출력 문제"
tags: ["구현", "수학"]
platform: "boj"
problem_number: "1000"
problem_url: "https://www.acmicpc.net/problem/1000"
difficulty: "브론즈 V"
language: "python"
---
```

#### 본문 템플릿

````markdown
## 문제

[BOJ 1000 - A+B](https://www.acmicpc.net/problem/1000)

> 문제 요약 (1-2줄)

## 풀이

접근 방식과 핵심 아이디어 설명

## 코드

\```python

# 솔루션 코드

\```

## 복잡도

- 시간: O(...)
- 공간: O(...)
````

### 5.5 배치 완료 확인

10개 처리 완료 후 사용자에게:

- 생성된 파일 목록 보고
- 남은 문제 수 안내
- 계속 진행할지 확인

## 6단계: 정리 및 결과 보고

GitHub URL로 클론한 경우 임시 디렉토리를 삭제합니다:

```bash
rm -rf $REPO_DIR
```

최종 결과:

```
=== Solutions 분석 완료 ===
생성된 파일: N개
스킵된 파일: M개 (이미 존재)
생성 목록:
  - _solutions/YYYYMMDD-boj-1000.mdx
  - _solutions/YYYYMMDD-boj-1001.mdx
  ...
```

## 작성 규칙

- 한국어로 작성
- 코드 블록의 언어 태그는 실제 풀이 언어에 맞춤
- 풀이 설명은 간결하게 핵심 아이디어 위주로 작성
- 문제 요약은 저작권을 고려하여 1-2줄로 제한
- 복잡도 분석은 시간·공간 복잡도 모두 기재
- **MDX 파싱 안전성**: 코드 블록 외부에서 `<`, `>`, `{`, `}` 문자는 반드시 백틱(`` ` ``)으로 감싸거나 `\`로 이스케이프 (예: `ArrayList<Integer>` → `` `ArrayList<Integer>` ``)
