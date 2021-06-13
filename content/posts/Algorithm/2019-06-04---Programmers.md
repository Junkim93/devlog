---
title: Lv1. 완주하지 못한 선수
date: "2019-06-04"
template: "post"
draft: false
slug: "programmers0604"
category: "Algorithm"
tags:
  - "Algorithm"
  - "Programmers"
  - "JavaScript"
description: "하루 한 개 알고리즘 풀기 잊지마 (프로그래머스)"
---
# 문제 및 답안

## 문제
마라톤에 참여한 선수들의 이름이 담긴 배열 participant와 완주한 선수들의 이름이 담긴 배열 completion이 주어질 때, 완주하지 못한 선수의 이름을 return 하도록 solution 함수를 작성해주세요.

#### 제한사항

- 마라톤 경기에 참여한 선수의 수는 1명 이상 100,000명 이하입니다.
- completion의 길이는 participant의 길이보다 1 작습니다.
- 참가자의 이름은 1개 이상 20개 이하의 알파벳 소문자로 이루어져 있습니다.
- 참가자 중에는 동명이인이 있을 수 있습니다.

#### 입출력 예

| participant                             | completion                       | return |
| :-------------------------------------- | :------------------------------- | :----- |
| [leo, kiki, eden]                       | [eden, kiki]                     | leo    |
| [marina, josipa, nikola, vinko, filipa] | [josipa, filipa, marina, nikola] | vinko  |
| [mislav, stanko, mislav, ana]           | [stanko, ana, mislav]            | mislav |

---

## JavaScript 답안

``` js
function solution(participant, completion) {
    var answer = '';
    // 답지 본 문제 ㅜㅜ

    // 배열 정렬
    participant.sort();
    completion.sort();

    // for문으로 값 비교 (해당 객체의 인덱스 값을 변수 i에 반환하고, 전체 순회함)
    for (let i in participant) {
        if (participant[i] !== completion[i]) return participant[i];
    }
    // completion의 길이는 participant의 길이보다 1이 작기때문에
    // 두 배열을 비교해주면 결국 participant의 마지막 값은 completion과 대응되지 않음
    // ex) "ana", "stanko", "mislav", "mislav"
    //     "ana", "stanko", "mislav", 대응되는 값이 null =>> 따라서 두 값은 같지않다.

    // completion의 인덱스 부분에 p를 넣을 수 있는 이유는
    // for in 루프 자체가 해당 배열의 인덱스 값을 반환하기 때문이다. (for in의 콜백함수는 index)

    // 기본 for문으로 구현
    for (let i = 0; i < participant.length; i++) {
         if (participant[i] !== completion[i]) return participant[i];
    }

    // 기존에 사용한 방법 (효율성 통과 실패)
    for (let c of completion) {
         for (let p of participant) {
             if (c === p) {
                 participant.splice(participant.indexOf(p), 1);
                 break;
             }
         }
     }
    answer = participant[0]
    return answer;
}
```
---

## 다른 사람 풀이 코드

``` js
const solution = (p, c) => {
    p.sort()
    c.sort()
    while (p.length) {
        let pp = p.pop()
        if (pp !== c.pop()) return pp
    }
}
```

이 코드랑 인터넷풀이 보고 기존에 잘 안다고 착각했던 것들이 많다는 것을 느꼈다.

## 어려웠던 점

- 속도에 대한 고민
- 동명이인을 처리하는 방법
- 생각보다 간단해서 민망했다.

---
출처: [프로그래머스](https://programmers.co.kr/learn/courses/30/lessons/42576)

