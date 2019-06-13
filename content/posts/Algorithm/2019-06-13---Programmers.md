---
title: Lv1. 나누어 떨어지는 숫자 배열
date: "2019-06-13"
template: "post"
draft: false
slug: "/posts/programmers0613"
category: "Algorithm"
tags:
  - "Algorithm"
  - "Programmers"
  - "JavaScript"
description: "하루 한 개 알고리즘 풀기 잊지마 (프로그래머스)"
---
# 문제 및 답안 

## 문제
array의 각 element 중 divisor로 나누어 떨어지는 값을 오름차순으로 정렬한 배열을 반환하는 함수, solution을 작성해주세요.
divisor로 나누어 떨어지는 element가 하나도 없다면 배열에 -1을 담아 반환하세요.

#### 제한사항

- arr은 자연수를 담은 배열입니다.
- 정수 i, j에 대해 i ≠ j 이면 arr[i] ≠ arr[j] 입니다.
- divisor는 자연수입니다.
- array는 길이 1 이상인 배열입니다.

#### 입출력 예

| arr           | divisor | return        |
| :------------ | :------ | :------------ |
| [5, 9, 7, 10] | 5       | [5, 10]       |
| [2, 36, 1, 3] | 1       | [1, 2, 3, 36] |
| [3,2,6]       | 10      | [-1]          |

---

## JavaScript 답안

``` js
function solution(arr, divisor) {
    var answer = [];
    
    for (let num of arr) {
        if (Number.isInteger(num / divisor)) {
            answer.push(num);
        }
    }
    
    answer.sort((a, b) => {
        return a - b;
    });
    
    if (answer.length === 0) answer.push(-1);
    
    return answer;
}
```
**풀기 전 생각한 것**

1. 배열 arr에 있는 값을 순회하며 divisor로 나눠본다.

2. 만약 divisor로 나누어 떨어진다면

   *이때 나누어 떨어진다는 처리를 어떻게 해야할까?

   *나누어 떨어진다는 의미는 반환되는 숫자가 정수여야만 한다.(라고 바보같이 처음에 생각해버림)

   *정수는 어떻게 구할까? isInteger() 메서드를 사용해서 정수값인지 확인함 (메서드에 의존한 것 같아서 이때부터 찜찜)

3. 해당 값을 정답 배열에 push한다.

4. 정답 배열을 오름차순으로 정렬한다.

5. 만약 divisor로 나누어 떨어지는 수가 한 개도 없다면 정답 배열에 -1을 push한다.

6. 끝

---

## 다른 사람 풀이 코드

``` js
function solution(arr, divisor) {
    var answer = [];

    for(var i = 0; i < arr.length; ++i) {
        if(arr[i] % divisor == 0) answer.push(arr[i]);
    }

    return answer.length < 1 ? [-1] : answer.sort((a, b) => a - b);
}
```

*나머지 값이 0 이어도 나누어 떨어지는 값이다.

- 삼항연산자를 잘 활용하자

## 어려웠던 점

- 나누어 떨어지는것 어떻게 처리해야할까 잠깐 고민

---
출처: [프로그래머스](https://programmers.co.kr/learn/courses/30/lessons/12910)





