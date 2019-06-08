---
title: 프로그래머스lv1. 모의고사
date: "2019-06-05"
template: "post"
draft: false
slug: "/posts/programmers0605"
category: "Algorithm"
tags:
  - "Algorithm"
  - "Programmers"
description: "하루 한 개 알고리즘 풀기 잊지마 (Programmers)"

---

# 문제 및 답안 

## 문제

1번 수포자가 찍는 방식: 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, ...
2번 수포자가 찍는 방식: 2, 1, 2, 3, 2, 4, 2, 5, 2, 1, 2, 3, 2, 4, 2, 5, ...
3번 수포자가 찍는 방식: 3, 3, 1, 1, 2, 2, 4, 4, 5, 5, 3, 3, 1, 1, 2, 2, 4, 4, 5, 5, ...

1번 문제부터 마지막 문제까지의 정답이 순서대로 들은 배열 answers가 주어졌을 때, 가장 많은 문제를 맞힌 사람이 누구인지 배열에 담아 return 하도록 solution 함수를 작성해주세요.

#### 제한사항

- 시험은 최대 10,000 문제로 구성되어있습니다.
- 문제의 정답은 1, 2, 3, 4, 5중 하나입니다.
- 가장 높은 점수를 받은 사람이 여럿일 경우, return하는 값을 오름차순 정렬해주세요.

#### 입출력 예

| answers     | return  |
| :---------- | :------ |
| [1,2,3,4,5] | [1]     |
| [1,3,2,4,2] | [1,2,3] |

------

## JavaScript 답안

```js
function solution(answers) {
    let answer = [];
    
    let p1 = [1, 2, 3, 4, 5],
        p2 = [2, 1, 2, 3, 2, 4, 2, 5],
        p3 = [3, 3, 1, 1, 2, 2, 4, 4, 5, 5];
    
    let score1 = 0;
    let score2 = 0;
    let score3 = 0;
    
    for (let i in answers) {
        let i1 = i % 5;
        let i2 = i % 8;
        let i3 = i % 10;
      	// 프로그래밍 언어에서 나머지 연산의 결과값은 0 ~ N-1이다. 
      	// 이 성질을 이용해서 반복되는 구간의 인덱스를 구할 수 있다.
        
        if (answers[i] === p1[i1]) score1++;
        if (answers[i] === p2[i2]) score2++;
        if (answers[i] === p3[i3]) score3++;
      	// 정답과 일치할때마다 점수를 올린다.
    }
    
    
    let maxScore = Math.max(score1, score2, score3)
    
    if (maxScore === score1) answer.push(1);
    if (maxScore === score2) answer.push(2);
    if (maxScore === score3) answer.push(3);
    
    return answer;
}
```

------

## 다른 사람 풀이 코드

```js
function solution(answers) {
    var answer = [];
    var a1 = [1, 2, 3, 4, 5];
    var a2 = [2, 1, 2, 3, 2, 4, 2, 5];
    var a3 = [ 3, 3, 1, 1, 2, 2, 4, 4, 5, 5];

    var a1c = answers.filter((a,i)=> a === a1[i%a1.length]).length;
    var a2c = answers.filter((a,i)=> a === a2[i%a2.length]).length;
    var a3c = answers.filter((a,i)=> a === a3[i%a3.length]).length;
    var max = Math.max(a1c,a2c,a3c);

    if (a1c === max) {answer.push(1)};
    if (a2c === max) {answer.push(2)};
    if (a3c === max) {answer.push(3)};


    return answer;
}
```



## 어려웠던 점

- 각각의 수포자가 찍은 값을 어떻게 순회할 것인지
- 최대값을 도출해내는 방법

------

출처: [프로그래머스](https://programmers.co.kr/learn/courses/30/lessons/42840?language=javascript)

