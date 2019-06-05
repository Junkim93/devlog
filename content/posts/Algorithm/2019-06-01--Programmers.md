---
title: 프로그래머스lv2. 다리를 지나는 트럭
date: "2019-06-01"
template: "post"
draft: false
slug: "/posts/programmers0601"
category: "Algorithm"
tags:
  - "Algorithm"
  - "Programmers"
description: "하루 한 개 알고리즘 풀기 잊지마 (Programmers)"
---
# 문제 및 답안 

## 문제
트럭 여러 대가 일 차선 다리를 정해진 순으로 건너려 합니다. 모든 트럭이 다리를 건너려면 최소 몇 초가 걸리는지 알아내야 합니다. 트럭은 1초에 1만큼 움직이며, 다리 길이는 bridge_length이고 다리는 무게 weight까지 견딥니다.
<br>
<br>
이때 모든 트럭이 다리를 건너려면 최소 몇 초가 걸리는지 return 하도록 solution 함수를 완성하세요.

## JavaScript 답안
``` js
function solution(bridge_length, weight, truck_weights) {
    var totalTrucks = truck_weights.length;
    var answer = 0;
    var timeOnRoadPerTruck = [];
    var arrivedTruck = [];
    var onBridgeTruck = [];
    var onBridgeTruckWeights = 0;
    
    // 다리 위에 있는 트럭 무게의 합
    function sumTruckWeights () {
        let sum = 0;
        for (let w of onBridgeTruck) sum += w;
        return sum;
    }    
    
    // 다리 위에서 트럭의 이동거리
    function goesbyTime () {
        for (let i = 0; i < timeOnRoadPerTruck.length; i++) {
            ++timeOnRoadPerTruck[i];
        }
    }

    // 다리 위에 있는 트럭 무게 다시 계산
    function initTruckWeights () {
        onBridgeTruckWeights = sumTruckWeights();
    } 
    
    while (arrivedTruck.length !== totalTrucks) {
        ++answer;        
        if (timeOnRoadPerTruck.length !== 0) goesbyTime();
        
        // 다리를 건넜는지 먼저 확인하여 처리
        if (timeOnRoadPerTruck[0] === bridge_length) {
            var truckOut = onBridgeTruck.shift();
            arrivedTruck.push(truckOut);
            timeOnRoadPerTruck.shift();
            initTruckWeights();
        }

        // 다리를 건널 트럭 추가
        if ((onBridgeTruckWeights + truck_weights[0]) <= weight) {
            var truckIn = truck_weights.shift();
            onBridgeTruck.push(truckIn);
            timeOnRoadPerTruck.push(0);
            initTruckWeights();
        }
    }
    return answer;
}
```
---

## 어려웠던 점
- 다리위에 있는 트럭의 이동시간을 구하는게 어려웠다.
    - 다리위에 있는 트럭마다의 이동시간을 나타내는 배열을 별도로 만들었다.
- 실행 순서에 따라 결과값이 차이가 나서 헤맸다.
    - 다리를 건널 트럭을 배열에 추가하기 전에, 다리를 다 건넌 트럭에 다한 처리를 해줘야했다

---
출처: [프로그래머스](https://programmers.co.kr/learn/courses/30/lessons/42583)