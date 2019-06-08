---
title: 프로그래머스lv1. 체육복
date: "2019-06-08"
template: "post"
draft: false
slug: "/posts/programmers0608"
category: "Algorithm"
tags:
  - "Algorithm"
  - "Programmers"
description: "하루 한 개 알고리즘 풀기 잊지마 (Programmers)"
---
# 문제 및 답안 

## 문제
전체 학생의 수 n, 체육복을 도난당한 학생들의 번호가 담긴 배열 lost, 여벌의 체육복을 가져온 학생들의 번호가 담긴 배열 reserve가 매개변수로 주어질 때, 체육수업을 들을 수 있는 학생의 최댓값을 return 하도록 solution 함수를 작성해주세요.

#### 제한사항

- 전체 학생의 수는 2명 이상 30명 이하입니다.
- 체육복을 도난당한 학생의 수는 1명 이상 n명 이하이고 중복되는 번호는 없습니다.
- 여벌의 체육복을 가져온 학생의 수는 1명 이상 n명 이하이고 중복되는 번호는 없습니다.
- 여벌 체육복이 있는 학생만 다른 학생에게 체육복을 빌려줄 수 있습니다.
- 여벌 체육복을 가져온 학생이 체육복을 도난당했을 수 있습니다. 이때 이 학생은 체육복을 하나만 도난당했다고 가정하며, 남은 체육복이 하나이기에 다른 학생에게는 체육복을 빌려줄 수 없습니다.

#### 입출력 예

| n    | lost            | reserve         | return |
| :--- | :-------------- | :-------------- | :----- |
| 5    | [2, 4]          | [1, 3, 5]       | 5      |
| 5    | [2, 4]          | [3]             | 4      |
| 3    | [3]             | [1]             |        |
| *5   | [1, 2, 3, 4, 5] | [1, 2, 3, 4, 5] | 5      |
| *5   | [4, 5]          | [3, 4]          | 4      |

---

## JavaScript 답안

``` js
function solution(n, lost, reserve) {
    var answer = 0;
    var haveNum = n - lost.length; 
  	// 전체 인원에서 도난당한 사람을 빼준다.
  	// haveNum은 체육복을 가진 사람의 숫자이다.

  	// 여벌의 체육복을 지녔지만 도난당한 사람이 있다면 
  	// 배열에서 지우고 haveNum 카운트를 올린다.
    for (let i = 0; i < lost.length; i++) {
        if (reserve.indexOf(lost[i]) !== -1) {
            reserve.splice(reserve.indexOf(lost[i]), 1);
            lost.splice(i, 1);
            haveNum ++;
            i--;				
          	// 일부러 포문을 사용한 이유가 있는데,
          	// 위에 있는 *의 테스트 케이스를 통과하기 위해서이다.
          	// 중복되는 모든 경우를 제거하기 위해서 i값을 다시 -1 해주었다.
        }
    }
	
  	// 잃어버린 사람 앞이나 뒤에 여벌의 체육복을 가진 사람이 있다면,
  	// 체육복을 빌리고, haveNum을 카운트한다.
    for (let num of lost) {
        let frontCheck = reserve.indexOf(num - 1)
        let behindCheck = reserve.indexOf(num + 1)
		
    // 잃어버린 학생이 3, 5 / 여벌가진 학생이 4 였을때
    // 4번 학생이 3번에게 빌려주고 
    // 또 다시 5번에게 빌려주는 경우를 제거하기 위해서
    // 빌려준 학생은 배열에서 제외시킨다.
        if (frontCheck !== -1) {
            reserve.splice(frontCheck, 1);
            haveNum++;
        } else if (behindCheck !== -1) {
            reserve.splice(behindCheck, 1);
            haveNum++;
        }
    }

    answer = haveNum;
    return answer;
}
```
---

## 다른 사람 풀이 코드

``` js
function solution(n, lost, reserve) {      
    return n - lost.filter(a => {
        const b = reserve.find(r => Math.abs(r-a) <= 1)
        if(!b) return true
        reserve = reserve.filter(r => r !== b)
    }).length
}
// 좋은 코드인지는 내가 능력이 부족해 잘 모르겠지만, 
// 다른 코드에 비해 압도적으로 짧아서 첨부해보았다.
```



## 어려웠던 점

- 이 문제에서 가장 많이 헤맨것은 예시 케이스는 통과해도 채점했을때는 안되는 케이스가 많았기 때문이다.
  - 결론은 테스트 케이스를 항상 고려하면서 코드를 짜야겠다.
- 마지막에 7번 케이스가 어떤 경우인지 몰라서 헤맸다. 좀 더럽게 짰다는 느낌이 항상 드는데, 꼭 다시 풀어봐야겠다. 
  - 테스트 케이스를 추가해보니 여벌의 체육복을 가진 사람이 모두 도난당했을 때의 경우로 추정된다.

---
출처: [프로그래머스](https://programmers.co.kr/learn/courses/30/lessons/42862)



