---
title: Lv1. K번째수
date: "2019-06-09"
template: "post"
draft: false
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
    
  	// 2차원 배열을 순회하기 위해 for of 문을 사용
    for (let value of commands) {
        let sliceNum = array.slice(value[0] - 1, value[1]);
      	// commands 배열 안에 있는 배열 값의 인덱스는 0부터 2까지로 고정되므로
      	// 각 배열의 원소 i, j 값에 접근하여 array 배열을 잘라낸다.
        sliceNum.sort( (a, b) => a - b );
      	// 잘라낸 배열을 정렬한다.
        // 이 때 sort() 메서드를 그대로 사용하면
      	// 아스키 문자 순서로 정렬된다.
        // 따라서 오름차순으로 정렬하기 위해서 위와같이 작성한다.
        answer.push(sliceNum[value[2] - 1]);
      	// k번째에 있는 수를 정답 배열에 push 한다.
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

***map()** 메서드는 배열 내의 모든 요소 각각에 대하여 주어진 함수를 호출한 결과를 모아 **새로운 배열을 반환**한다.

- 2차원 배열인 commands의 v값은 array, [i, j, k]를 가진 배열이다.
- 따라서 v[0] 값은 i, v[1] 값은 j에 해당한다. 배열은 0부터 시작하기 때문에 잘라내기 시작할 위치인 v[0] 에서 -1을 빼준 값부터 잘라낸다.
- 해당 값을 메서드를 이용해서 정렬 해준다.
- **slice()** 메서드는 slice(begin, end) **시작값과 엔드값**을 매개변수로 받아서 새로운 배열 객체로 반환한다. 이 때 **end 값은 미포함**이다.
- k에 해당하는 값 - 1(위와 동일)에서, k값(미포함)까지를 잘라내니, 결국은 우리가 원하는 k번째 숫자를 잘라내게 된다.
- 배열로 반환받았기 때문에, 해당 배열의 첫 번째 원소(index: 0)을 리턴하면 문제에서 요구하는 연산을 수행한 결과값을 반환하게 된다.
- 나머지 인덱스도 반복해서 수행하여 나온 결과값을 배열로 반환한다 (map() 메서드를 사용했기 때문에)

## 어려웠던 점

- sort() 함수에 주의하자
  - sort()만 사용하는 것은 오름차순으로 정렬하는 것이 아니다.

---
출처: [프로그래머스](https://programmers.co.kr/learn/courses/30/lessons/42748)



