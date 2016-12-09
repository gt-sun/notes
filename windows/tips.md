


## 百度网盘

F12 在console里：

Object.defineProperty(this , 'navigator' , {value: { platform: ""}});

## chrome标签声音

chrome://flags/#enable-tab-audio-muting

## 创建任意大小文件

`fsutil file createnew 盘符:\ 文件名. 后缀名 大小（例如 2048000000，约等于 1.90G，按字节计算）`

## 添加右键快捷键

找到`HKEY_CLASSES_ROOT\*\shell`，在`shell`下新建一个项目`UltraEdit`，再在新建的UltraEdit下新建`command`项目。

设置UltraEdit和command的数据值
ultraEdit的：双击‘名称’打开如下窗口：这个数据是显示在右键的文字。


command的：打开command项目双击‘名称’下面的‘（默认）’如下图：
在数据值中写入Uedit32.exe文件所在的位置，并在末尾加上空格和 %1 ，
我的是：D:\Program Files\IDM Computer Solutions\UltraEdit\Uedit32.exe
