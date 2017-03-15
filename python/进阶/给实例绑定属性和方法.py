from types import MethodType

class C(object):
    pass


c = C()
c.name = "Tim"  # 绑定属性
print(c.name)


def set_age(self,age):
    self.age = age

c.set_age = MethodType(set_age,c) #绑定方法
c.set_age(22)
print(c.age)

#对其他实例无效
cc = C()
cc.set_age(22) #error


#可以给类绑定方法来实现
class C(object):
    pass

def set_age(self,age):
    self.age = age


C.set_age = set_age
c = C()
c.set_age(22)
print(c.age)



############限制实例可以绑定的属性和方法##############
#使用__slots__

class C():
	__slots__ = ("name","age")

c = C()
c.name = "Time"
c.age = 22
print(c.name,c.age) #Time 22

c.address = "人民路" #AttributeError: 'C' object has no attribute 'address'
