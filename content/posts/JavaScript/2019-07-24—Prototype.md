---
title: "JavaScript Prototype에 대해 알아보기"
date: "2019-07-24T05:35:56.816Z"
template: "post"
draft: false
slug: "/posts/prototype"
category: "JavaScript"
tags:
  - "JavaScript"
description: "JavaScript Info의 내용을 개인적으로 번역하고 정리한 글입니다 📖"
---

### <u>Reference</u>

 [Javascript Info, "prototype"](http://javascript.info/prototype-inheritance) <br>
 Javascript Info 의 내용을 번역하고, 일부 제 의견을 추가했습니다. <br>
혹여 게재한 내용에 문제가 있다면 알려주세요. 바로 조취하겠습니다.

---



## Prototypal Inheritance

- 프로그래밍을 할 때 종종 어떤 것을 만들고 나서 확장해야 하는 경우가 있습니다.

  예를 들어서, 기존에 user 라는 객체가 있다고 가정해 보겠습니다.

  ```javascript
  const user = {
  	id: "Hell",
  
  	welcome() {
  		alert(`${this.id}, Hello World!`);
  	}
  };
  ```

  user 라는 객체가 있다고 가정해보겠습니다. user는 자기만의 property 와 methods 를 가지고 있습니다. 우리는 user에서 약간 수정한 버전인 'admin' 과 'guest' 라는 것을 만들고 싶습니다.

  근데 그냥 만들기에는 너무 번거로워서, user 객체에서 가지고 있는 요소를 재사용 하고 싶습니다. user 안의 methods를 복사하거나 재할당 하는게 아니라, user 객체 위에 새로운 객체를 만들고 싶은 것이죠.

  Prototypal inheritance 은 바로 우리가 하고싶은 것을 도와주는 언어적인 특징입니다.

  ------

  ### [[Prototype]]

  자바스크립트에서 객체는 [[Prototype]] 이라는 특별하게 숨겨진 property를 가집니다.

  이 [[prototype]]은 null 값을 갖거나 다른 객체를 참고한 값을 가집니다. 이 객체를 바로 "prototype" 이라고 부릅니다.

  프로토타입은 약간 마법같은 느낌입니다. 우리가 객체에서 property를 읽기를 원하는데, 이걸 놓쳤을 때, 자바스크립트는 자동으로 프로토타입으로 부터 property를 가져옵니다. 프로그래밍에서 이런 로직은 **prototypal inheritance** 라고 불립니다. 멋진 언어들이 특징으로 가지고 있고 여러 프로그래밍 기술들이 이걸 기반으로 하고 있습니다.

  property인 [[prototype]] 은 내부에 숨겨져 있습니다. 하지만 이걸 설정할 수 있는 다양한 방법들이 있습니다.

  그 중에 하나가 ***\*proto**** 를 사용한 방법입니다.

  ```javascript
  let animal = {
  	eats: true
  };
  
  let rabbit = {
  	jumps: true
  };
  
  // 여기까지 입력하고 rabbit.eats 를 호출하면
  // 당연히 undefined 가 출력됩니다.
  // 왜냐하면 rabbit 에는 eats라는 프로퍼티가 없기 때문입니다.
  
  rabbit.__proto__ = animal;
  // rabbit의 proto를 animal 로 설정해 주었습니다.
  console.log(rabbit.eats) // true;
  // animal 에서부터 eats라는 프로퍼티를 가져와서 값을 출력합니다.
  ```

  **proto** 는 [[Prototype]] 을 위해서 설정된 getter/setter 입니다. 기억해야할게 있습니다. [[Prototype]] 과 **proto** 은 같지 않습니다. 그냥 [[Prototype]] 을 위한 getter/setter 입니다.

  rabbit 에서 property 를 찾는데 놓쳤다면, 자바스크립트는 자동으로 animal 객체로부터 해당 property 를 가져옵니다.

  예제 코드를 보겠습니다.

  ```javascript
  const animal = {
  	eats: true
  };
  const rabbit = {
  	jumps: true
  };
  
  rabbit.__proto__ = animal; // (1)
  
  // 이제 우리는 rabbit 객체에서 두 개의 properties 를 모두 찾을 수 있습니다
  alert(rabbit.eats);
  alert(rabbit.jumps);
  ```

  예제를 보면 rabbit 객체에는 오직 jumps라는 프로퍼티만 존재합니다. 그래서 (1)에서 rabbit의 **proto** 에 animal 을 할당해줍니다. 이렇게 선언함으로서 rabbit 객체의 prototype은 animal이 되었습니다. 그리고 우리가 rabbit 객체에서 eats 라는 프로퍼티를 호출했을 때 eats 라는 프로퍼티가 없는 rabbit 객체는 animal 객체에서 eats 라는 프로퍼티를 찾게 됩니다. 그리고 그 값을 호출합니다.

  prototype 의 뜻을 한번 생각해 볼 필요가 있습니다. prototype 의 뜻은 원형입니다. rabbit 객체는 원형 객체인 animal 로 부터 프로퍼티와 값을 참조할 수 있게 된 것입니다.

  같은 개념으로 animal 객체에 method가 있다면, rabbit 객체에서 호출할 수 있습니다.

  ```javascript
  const animal = {
  	name: "animal",
  	eats: true,
  	walk() {
  		alert(`${this.name} is walking`);
  	}
  };
  
  const rabbit = {
  	name: "rabbit",
  	jumps: true,
  	__proto__: animal
  };
  
  rabbit.walk(); // "rabbit is walking"
  ```

  walk() 메서드를 자동으로 원형 객체로부터 가져옵니다.

  prototype chain 은 이것보다 길어질 수도 있습니다.

  ```javascript
  const animal = {
  	name: "animal",
  	eats: true,
  	walk() {
  		alert(`${this.name} is walking`);
  	}
  };
  
  const rabbit = {
  	name: "rabbit",
  	jumps: true,
  	__proto__: animal
  };
  
  let bigFoot = {
  	footSize: 270,
  	__proto__: rabbit
  };
  
  // walk() 메서드를 animal 객체로 부터 가져오고,
  // name 프로퍼티를 rabbit 객체에서 가져와서 출력합니다.
  bigFoot.walk(); // "rabbit is walking"
  
  // 만약 rabbit 객체에서 name 프로퍼티를 지운다면,
  // bigFoot 객체는 animal 객체에서 name 프로퍼티를 읽어와서 출력합니다.
  ```

  여기에는 실제로 두 가지 제약이 있습니다.

  1. 원문은 'The references can't go in circles. JavaScript will throw an error if we try to assign **proto** in a circle.' 이라고 표기 돼 있습니다.

     이 부분에 대해서 저는 참조는 순환하는 형태를 띌 수 없다고 보았습니다.(Tree 와 Graph 같이) 그래서 상위 객체의 **proto** 값으로 하위 객체를 할당 했을 때, 자바스크립트는 오류를 던집니다.

  2. **proto** 의 값은 object 나 null 만 성립합니다. 원시값 같은 다른 형태는 무시됩니다.

  **[[Prototype]] 은 오직 하나만 성립합니다. 두 개의 다른 객체의 값을 참조할 수는 없습니다.**

  ------

  ### Writing doesn't use prototype

  프로토타입은 읽기 프로퍼티에만 사용됩니다.

  쓰기 / 삭제 작업은 객체가 직접 작동합니다.

  아래 예제에서 rabbit 객체는 스스로 walk 메서드를 할당합니다.

  ```javascript
  let animal = {
  	eats: true,
  	walk() {
  		/* this method won't be used by rabbit */
  	}
  };
  
  let rabbit = {
  	__proto__: animal
  };
  
  rabbit.walk = function() {
  	alert("Rabbit! Bounce-bounce!");
  };
  
  rabbit.walk(); // Rabbit! Bounce-bounce!
  rabbit // {walk: f}
  ```

  이제, rabbit.walk() 호출은 메서드를 자기 자신의 객체에서 즉시 발견하고 실행합니다. 프로토타입을 사용하지 않습니다.

  이건 접근자가 아니라, 데이터 프로퍼티를 위한 겁니다. 만약에 프로퍼티가 getter/setter 면 함수처럼 행동합니다. (getters/setters 는 프로토타입 안에서 갇힙니다)

  이런 이유로 admin.fullName 은 아래 코드에서 정확하게 작동합니다.

  ```javascript
  const user = {
  	name: "John",
  	surname: "Smith",
  
  	set fullName(value) {
  		[this.name, this.surname] = value.split(" ");
  	},
  
  	get fullName() {
  		return `${this.name} ${this.surname}`;
  	}
  };
  
  const admin = {
  	__proto__: user,
  	isAdmin: true
  };
  
  alert(admin.fullName); // John Smith (1)
  
  // setter triggers!
  admin.fullName = "Alice Cooper"; // (2)
  ```

  (1)에서 프로퍼티인 admin.fullName 은 원형인 유저 객체 안에 있는 getter 를 불러올 수 있게 됩니다.  그리고 (2)에서 fullName 프로퍼티는 다시 원형 안에서 setter를 불러올 수 있습니다.

  동물과 토끼 예제도 다시 한번 바꿔보겠습니다.

  ```javascript
  let animal = {
  	eats: true,
  	
  	set walk(value) {
  		this.name = value;
      },
  	get walk() {
  		return console.log(`${this.name}! Bounce-bounce!`);
      }
  };
  
  let rabbit = {
  	__proto__: animal
  };
  
  rabbit.walk = "rabbit";
  rabbit.walk;   // "rabbit! Bounce-bounce!"
  ```

  ------

  ### The value of "this"

  위 예제에 대한 흥미로운 질문이 있습니다. set fullName(value) 에서 this의 값은 어떤 것 일까요? 프로퍼티인 [this.name](http://this.name) 과 this.surname 은 user 혹은 admin 중에서 어디에 쓰일까요?

  답은 간단합니다. this 는 프로토타입에 전혀 영향을 미치지 않습니다.

  객체나 객체의 프로토타입 등, 메서드가 어디서 발견되든, 메서드 호출에서, this 는 항상 dot 전의 객체를 가리킵니다.

  이건 실제로 굉장히 중요한 특징입니다. 왜냐면 많은 메서드와 상속 관계가 있는 큰 객체를 가지게 될 수 있기 때문입니다. 프로토타입 체인이 형성된 객체들은 메서드를 실행시키고, 프로토타입인 객체가 아니라 프로토타입을 참고하는 객체들의 상태를 수정할 것입니다.

  예를 들어서, 예제에 있는 animal 객체는 메서드 저장소를 나타냅니다. 그리고 rabbit 객체가 그걸 사용합니다.

  rabbit.sleep() 호출은 rabbit 객체에 this.isSleeping 이란 값을 설정합니다.

  ```javascript
  // animal has methods
  const animal = {
  	walk() {
  		if (!this.isSleeping) {
  			alert(`I walk`);
  		}
  	},
  	sleep() {
  		this.isSleeping = true;
  	}
  };
  
  const rabbit = {
  	name: "White Rabbit",
  	__proto__: animal
  };
  
  // modifies rabbit.isSleeping
  rabbit.sleep();
  
  alert(rabbit.isSleeping); // true
  alert(animal.isSleeping); 
  // undefined (no such property in the prototype)
  ```

  만약 우리가 bird 나 snake 같이 프로토타입 animal 로 부터 값을 참조하는 객체를 가졌을때, 이 객체들 또한 animal 객체의 메서드에 접근 권한을 얻을 것입니다. 하지만 각 메서드 안에 있는 this 는 메서드가 실행된 객체(호출하는 시점에 평가되는)에 맞춰 응답할 것입니다. animal 객체가 아니라요. 그래서 우리가 this로 데이터를 쓸 때, this가 가리키는 객체들 안에 데이터가 저장됩니다.

  결과적으로 메서드는 공유됩니다. 하지만 객체의 state는 아닙니다.

  this는 실행 컨텍스트가 중요하다는 것을 항상 기억해야 합니다.

  ------

  ### for ...in loop

  for..in 은 참조한 프로퍼티를 마찬가지로 순회한다.

  ```javascript
  let animal = {
  	eats: true
  };
  
  let rabbit = {
  	jumps: true,
  	__proto__: animal
  };
  
  // Object.keys only return own keys
  console.log(Object.keys(rabbit));   // jumps
  
  // for..in loops over both own and inherited keys
  for (let prop in rabbit) console.log(prop); // jumps, then eats
  ```

  만약 순회한 값이 우리가 원하는 것이 아니고,  참조한 프로퍼티는 배제 하기를 원한다면, obj.hasOwnProperty(key) 라는 내장 메서드를 사용하면 됩니다.

  이 메서드를 통해 참조하는 프로퍼티를 추출해 낼 수 있습니다.

  ```javascript
  const animal = {
  	eats: true
  };
  
  const rabbit = {
  	jumps: true,
  	__proto__: animal
  };
  
  for(let prop in rabbit) {
  	let isOwn = rabbit.hasOwnProperty(prop);
  
  	if (isOwn) {
  		console.log(`Our: ${prop}`); // Our: jumps
  	} else {
  		console.log(`Inherited: ${prop}`); // Inherited: eats
  	}
  }
  ```

  rabbit 은  animal 객체를 상속하고, 또 animal 객체는 Object.prototype 으로부터 상속합니다.

  그리고 그 위에 null 속성이 있습니다.

  한 가지 재밌는 사실을 기억해 주세요. rabbit.hasOwnProperty 라는 메서드는 어디서 오는 걸까요? 우리는 이 메서드를 정의하지 않았습니다. 프로토타입 체인 내에서 이 메서드는 Object.prototype.hasOwnPrototype 의 형태로 제공되는 걸 알 수 있습니다. 다른 말로 하자면, 상속받은 것이죠.

  그런데 왜 hasOwnProperty 는 foir..in 루프에서 나타나지 않을까요? eats나 jumps 처럼요. 만약 그 모든 상속받은 프로퍼티를 나열하는 개념이라면요.

  답은 간단합니다: Object.prototype 의 다른 모든 프로퍼티는 열거할 수 없습니다. 해당 프로퍼티들의 enumerable: false flag를 가지고 있습니다. 이게 나열되지 않는 이유입니다.

  다른 모든 iteration 메서드들도 상속받는 프로퍼티를 무시합니다. Object.keys 나 Object.values 와 같은 다른 모든 key/value-getting 메서드 등도 상속받는 프로퍼티를 무시합니다. 얘네들은 오직 스스로의 오브젝트에서 실행됩니다. Properties from the prototype are taken into account.

  ### Summary

  - 자바스크립트에서 모든 객체는 숨겨진 [[Prototype]] 프로퍼티를 가집니다. 이 프로퍼티는 또 다른 객체나 null 값을 가집니다.
  - 우리는 [[Prototype]] 프로퍼티에 접근하기 위해 obj.**proto** 를 사용할 수 있습니다.
  - 객체는 "prototype" 이라고 불리는 [[Prototype]] 에 의해서 참조됩니다.
  - obj 의 프로퍼티를 읽거나 메서드를 호출하길 원하는데, 존재하지 않는다면, 자바스크립트는 프로토타입에서 그 값을 발견하려고 시도합니다.
  - 해당 객체에서 직접 하는 Write/delete 작업은 프로토타입을 사용하지 않습니다. (setter 가 아니라 데이터 프로퍼티로 가정하기 때문입니다)
  - obj.method() 를 호출할 때 메서드는 프로토타입으로 부터 값을 가져오지만, this 는 obj 를 참조합니다. 그래서 메서드는 상속받은 값일때도 항상 현재 오브젝트와 함께 작동합니다.
  - for..in 루프는 상속 값과 고유 값 둘 다를 순회합니다. 다른 모든 key/value-getting 메서드들은 오직 해당 객체 위에서만 작동합니다.

  ------

  