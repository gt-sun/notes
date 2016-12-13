[TOC]

## TIPS

- 使用`\`转义或者再加上另一个单引号；
- 在sql语句中不要使用双引号，因为在其他语言中是用的双引号；



## SELECT 优化

### `%` 的替代方法

`name LIKE 'Abc%'`重写为：`name >= 'Abc' AND name < 'Abd'`

### `IN` 和 `ANY`

下面2条语句等价：

`SELECT col_1 FROM t1 WHERE col_1 = ANY (SELECT col_1 from t2);`
`SELECT col_1 FROM t1 WHERE col_1 in (SELECT col_1 from t2);`

或者使用`OR`。

### 多个`WHERE`条件的分开

`SELECT * FROM student WHERE  (sex='f' AND sno > 15) OR age > 18;`改写为
`SELECT * FROM student WHERE sex='f' AND sno > 15 UNION SELECT * FROM student WHERE age > 18;`


## 字符串切割

选取 location 列 右边的2个字符：
`select right(location, 2) from my_table;`

选取location列 从左边 第一个逗号前面的字符串
`select substring_index(location, ',', 1) from my_table;`

从第3个位置开始 选取2个字符串
`select substring('aa bb cc', 3, 2);`


## `ALTER`语句

- 添加列：

`ALTER TABLE t1 ADD COLUMN u_id INT NOT NULL AUTO_INCREMENT FIRST,ADD PRIMARY KEY (u_id);`

- rename表名：

`ALTER TABLE name1 RENAME TO name2;`

- change列名：

把number改为u_id，并设为主键
`ALTER TABLE name1
CHANGE COLUMN number u_id INT NOT NULL AUTO_INCREMENT,
ADD PRIMARY KEY (u_id);`

PS : 如果更改数据类型可能丢失数据

- modify数据类型

`ALTER TABLE name1
MODIFY COLUMN u_id varchar(12);`

- 删除列

`ALTER TABLE name1 DROP COLUMN u_id;`

- 删除主键

`ALTER TABLE name1 DROP PRIMARY KEY;`


## `UPDATE`语句

- `case`语句

```
update my_table
set new_column = 
case
    when col1 = value1
        then newvalue1
    when col2 = value2
        then newvalue2
    else newvalue3
end;
```


## 联合查询

### `UNION` `UNION ALL`

`UNION`的结果没有重复值，类似于`SELECT DISTINCT`，而`UNION ALL`有。

`SELECT Date FROM Store_Information
UNION
SELECT Date FROM Internet_Sales;`

*任何`SELECT`查询都可用于新建表*，如下：

```sql
CREATE TABLE mytable AS
SELECT Date FROM Store_Information UNION
SELECT Date FROM Internet_Sales;
```

### 多表连接

- 内联接

> 内联接使用比较运算符根据每个表共有的列的值匹配两个表中的行。例如，检索 students 和 courses 表中学生标识号相同的所有行。

Ps: `on` 关键字也可以用 `where` 代替。

相等内联接：

`select boys.boy, toys.toy from boys inner join toys on boys.toy_id = toys.toy_id;`

不等内联接：

`select boys.boy, toys.toy from boys inner join toys on boys.toy_id <> toys.toy_id;`


- 交叉连接

**返回两张表的每一行相乘的结果**

`select t.toy, b,boy from toys as t cross join boys as b;`
cross join 可以省略
`select t.toy, b,boy from toys as t, boys as b;`

PS：
- 避免对很大的表进行交叉联接；
- 交叉联接是内联接的一种，内联接基本上就是通过查询中的条件移除了某些结果数据行后的交叉联接；

- 外连接

在 FROM 子句中指定外联接时，可以由下列几组关键字中的一组指定：     
1）LEFT  JOIN 或 LEFT OUTER JOIN     
左向外联接的结果集包括  LEFT OUTER 子句中指定的左表的所有行，而不仅仅是联接列所匹配的行。如果左表的某行在右表中没有匹配行，则在相关联的结果集行中右表的所有选择列表列均为空值。       
2）RIGHT  JOIN 或 RIGHT  OUTER  JOIN     
右向外联接是左向外联接的反向联接。将返回右表的所有行。如果右表的某行在左表中没有匹配行，则将为左表返回空值。       
3）FULL  JOIN 或 FULL OUTER JOIN
完整外部联接返回左表和右表中的所有行。当某行在另一个表中没有匹配行时，则另一个表的选择列表列包含空值。如果表之间有匹配行，则整个结果集行包含基表的数据值。 

例子：   

```
-------------------------------------------------
  a 表        id   name     b 表       id   job   parent_id   
              1   张 3                 1     23     1   
              2   李四                 2     34     2   
              3   王武                 3     34     4       
  a.id 同 parent_id   存在关系   
--------------------------------------------------    
```

 1） 内连接   
  select   a.*,b.*   from   a   inner   join   b     on   a.id=b.parent_id       
  结果是     
  1   张 3                   1     23     1   
  2   李四                  2     34     2   

  2）左连接   
  select   a.*,b.*   from   a   left   join   b     on   a.id=b.parent_id       
  结果是     
  1   张 3                   1     23     1   
  2   李四                  2     34     2   
  3   王武                  null   