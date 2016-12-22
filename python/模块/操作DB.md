[TOC]


---



## mysqlclient

https://github.com/PyMySQL/mysqlclient-python

https://www.python.org/dev/peps/pep-0249/

## api说明

### **execute()**

```
import pymysql
conn = pymysql.connect(host='192.168.1.205', user='root', password='123456', db='kaqu')
c = conn.cursor()

#使用多参数
sql = "select * from wp_users where ID = %(id)s or ID = %(id2)s"
c.execute(sql, {"id": 2, "id2": 4})

#使用format
sql = "select * from wp_users where ID = '{0}' or ID = '{1}'"
c.execute(sql.format(2, 4))

print(c.fetchall())
 
c.close()
conn.close()
```

### **executemany()**


```
import pymysql
conn = pymysql.connect(host='192.168.1.205', user='root', password='123456', db='kaqu')
c = conn.cursor()
sql = "insert into sun (name, age) VALUES (%s, %s)"
data = [
    ("aaa", 19),
    ("bbb", 20),
    ("ccc", 32)
]
 
c.executemany(sql, data)
print(c.rowcount)  #打印执行的行数
conn.commit()
 
c.close()
conn.close()
```

## PyMySQL

优点：
不用依赖一些 mysql 组件，在win 7 下可安装。

安装：`pip install PyMySQL`

实例：

```
In [1]: import pymysql
 
In [2]: conn = pymysql.connect(host='192.168.1.205', user='root', password='123456', db='kaqu', charset='utf8')
 
In [3]: c = conn.cursor()
 
In [4]: c.execute('select * from t2')
Out[4]: 5
 
……
```

github：
```
import pymysql.cursors
 
# Connect to the database
connection = pymysql.connect(host='localhost',
                             user='user',
                             password='passwd',
                             db='db',
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)
 
try:
    with connection.cursor() as cursor:
        # Create a new record
        sql = "INSERT INTO `users` (`email`, `password`) VALUES (%s, %s)"
        cursor.execute(sql, ('webmaster@python.org', 'very-secret'))
 
    # connection is not autocommit by default. So you must commit to save
    # your changes.
    connection.commit()
 
    with connection.cursor() as cursor:
        # Read a single record
        sql = "SELECT `id`, `password` FROM `users` WHERE `email`=%s"
        cursor.execute(sql, ('webmaster@python.org',))
        result = cursor.fetchone()
        print(result)
finally:
    connection.close()
```

```
import pymysql
 
conn = pymysql.connect(host='localhost', port=3306, user='root', passwd='', db='mysql')
 
cur = conn.cursor()
 
cur.execute("SELECT Host,User FROM user")
 
print(cur.description)
 
for row in cur:   #cur 可以直接用来迭代
    print(row)
 
cur.close()
conn.close()
```