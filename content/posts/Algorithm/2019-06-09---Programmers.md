---
title: Lv1. 가운데 글자 가져오기
date: "2019-06-09"
template: "post"
draft: true
slug: "/posts/programmers0609"
category: "Algorithm"
tags:
  - "Algorithm"
  - "Programmers"
  - "JavaScript"
description: "하루 한 개 알고리즘 풀기 잊지마 (프로그래머스)"
---
# 문제 및 답안 

## 문제
단어 s의 가운데 글자를 반환하는 함수, solution을 만들어 보세요. 단어의 길이가 짝수라면 가운데 두글자를 반환하면 됩니다.

#### 제한사항

- s는 길이가 1 이상, 100이하인 스트링입니다.

#### 입출력 예

| s     | return |
| :---- | :----- |
| abcde | c      |
| qwer  | we     |

---

## JavaScript 답안

``` js
function solution(s) {
    var answer = '';
    
    // 홀수일 때
    if (s.length % 2 === 1) {
        let num = Math.floor(s.length / 2);
        return s[num];
    }
    
    // 짝수일 때
    if (s.length % 2 === 0) {
        let num = s.length / 2;
        return s[num-1] + s[num];
    }
    
    return answer;
}
```
---

## 다른 사람 풀이 코드

``` js
function solution(s) {
    return s.substr(Math.ceil(s.length / 2) - 1, s.length % 2 === 0 ? 2 : 1);
}
```



## 어려웠던 점

- 코드를 훨씬 짧게 줄이는 방법을 생각해보자
  - 결론은 테스트 케이스를 항상 고려하면서 코드를 짜야겠다.
- 마지막에 7번 케이스가 어떤 경우인지 몰라서 헤맸다. 좀 더럽게 짰다는 느낌이 항상 드는데, 꼭 다시 풀어봐야겠다. 
  - 테스트 케이스를 추가해보니 여벌의 체육복을 가진 사람이 모두 도난당했을 때의 경우로 추정된다.

---
출처: [프로그래머스](https://programmers.co.kr/learn/courses/30/lessons/12903)





