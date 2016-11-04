The shutil module offers a number of high-level operations on files and collections of files. In particular, functions are provided which support file copying and removal. For operations on individual files, see also the os module.

> Warning：Even the higher-level file copying functions (shutil.copy(), shutil.copy2()) cannot copy all file metadata.


- shutil.make_archive()

```
>>> from shutil import make_archive
>>> import os
>>> archive_name = os.path.expanduser(os.path.join('~', 'myarchive'))
>>> root_dir = os.path.expanduser(os.path.join('~', '.ssh'))
>>> make_archive(archive_name, 'gztar', root_dir)
'/Users/tarek/myarchive.tar.gz'
```

第一个参数：`/Users/tarek/myarchive`，指定压缩包的前缀；
第二个参数：压缩包格式；
第三个参数：被压缩的目录；
