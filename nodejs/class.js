
// 官方文档：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes

// ============实例1================
class Myclass {
  constructor(height, width) {
    this.height = height
    this.width = width
  }

  get area() {
    return this.caclArea()
  }

  caclArea() {
    return this.height * this.width
  }
}

var res = new Myclass(3, 4)
console.log(res.area) // 12


// =========静态方法=========
/*
static定义类的静态方法。
静态方法是指那些不需要对类进行实例化，使用类名就可以直接访问的方法，
需要注意的是静态方法不能被实例化的对象调用。
静态方法经常用来作为工具函数
*/

class Point{
  constructor(x,y){
    this.x = x
    this.y = y
  }

  static distance(a,b){
    const dx = a.x - b.x
    const dy = a.y - b.y
    return Math.sqrt(dx*dx + dy*dy)
  }
}

const p1 = new Point(5,5)
const p2 = new Point(8,9)
console.log(Point.distance(p1,p2))


// =========extends 创建子类=============

class Animal{
  constructor(name){
    this.name = name
  }

  speak(){
    console.log(this.name + 'make a nose.')
  }

  speakagain(){
    console.log(this.name + ' again!')
  }
}

class Dog extends Animal{
  speak(){
    console.log(this.name + ' barks.')
  }
}

var d = new Dog('baidu')
d.speak() //baidu barks.
d.speakagain() //baidu again!

//如果子类中存在构造函数，则需要在使用 “this” 之前首先调用 super()

//也可以扩展基于函数的类，如下：
function Animal (name) {
  this.name = name;  
}
Animal.prototype.speak = function () {
  console.log(this.name + ' makes a noise.');
}

class Dog extends Animal {
  speak() {
    super.speak(); 
    console.log(this.name + ' barks.');
  }
}

var d = new Dog('Mitzie');
d.speak(); 

/*
//Mitzie makes a noise.
Mitzie barks.
*/


//使用super方法
class Polygon{
  constructor(height,width){
    this.name = 'Polygon'
    this.height = height
    this.width = width
  }

  sayName(){
    console.log('Hi, Im a ',this.name)
  }
}

class Square extends Polygon{
  constructor(length){
    super(length,length)
    this.name = 'Square'
  }

  get area(){
    return this.height * this.width
  }

  set area(value){
    this.area = value
  }
}

var s = new Square(5)
s.sayName()
console.log(s.area)

/*
Hi, Im a  Square
25
*/