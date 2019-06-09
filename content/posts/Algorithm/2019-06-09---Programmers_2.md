---
title: Lv1. K번째수
date: "2019-06-09"
template: "post"
draft: true
slug: "/posts/programmers0609_2"
category: "Algorithm"
tags:
  - "Algorithm"
  - "Programmers"
  - "JavaScript"
description: "하루 한 개 알고리즘 풀기 잊지마 (프로그래머스)"
---
# 문제 및 답안 

## 문제
배열 array의 i번째 숫자부터 j번째 숫자까지 자르고 정렬했을 때, k번째에 있는 수를 구하려 합니다.

예를 들어 array가 [1, 5, 2, 6, 3, 7, 4], i = 2, j = 5, k = 3이라면

1. array의 2번째부터 5번째까지 자르면 [5, 2, 6, 3]입니다.
2. 1에서 나온 배열을 정렬하면 [2, 3, 5, 6]입니다.
3. 2에서 나온 배열의 3번째 숫자는 5입니다.

배열 array, [i, j, k]를 원소로 가진 2차원 배열 commands가 매개변수로 주어질 때, commands의 모든 원소에 대해 앞서 설명한 연산을 적용했을 때 나온 결과를 배열에 담아 return 하도록 solution 함수를 작성해주세요.

#### 제한사항

- array의 길이는 1 이상 100 이하입니다.
- array의 각 원소는 1 이상 100 이하입니다.
- commands의 길이는 1 이상 50 이하입니다.
- commands의 각 원소는 길이가 3입니다.

#### 입출력 예

| array                 | commands                          | return    |
| :-------------------- | :-------------------------------- | :-------- |
| [1, 5, 2, 6, 3, 7, 4] | [[2, 5, 3], [4, 4, 1], [1, 7, 3]] | [5, 6, 3] |

---

## JavaScript 답안

``` js
function solution(array, commands) {
    var answer = [];
    
    for (let value of commands) {
        let sliceNum = array.slice(value[0] - 1, value[1]);
        sliceNum.sort( (a, b) => a - b );
        answer.push(sliceNum[value[2] - 1]);
    }
    return answer;
}
```
---

## 다른 사람 풀이 코드

``` js
function solution(array, commands) {
    return commands.map(v => {
        return array.slice(v[0] - 1, v[1]).sort((a, b) => a - b).slice(v[2] - 1, v[2])[0];
    });
}
```



## 어려웠던 점

- sort() 함수에 주의하자
  - 결론은 테스트 케이스를 항상 고려하면서 코드를 짜야겠다.
- 마지막에 7번 케이스가 어떤 경우인지 몰라서 헤맸다. 좀 더럽게 짰다는 느낌이 항상 드는데, 꼭 다시 풀어봐야겠다. 
  - 테스트 케이스를 추가해보니 여벌의 체육복을 가진 사람이 모두 도난당했을 때의 경우로 추정된다.

---
출처: [프로그래머스](https://programmers.co.kr/learn/courses/30/lessons/42748)



