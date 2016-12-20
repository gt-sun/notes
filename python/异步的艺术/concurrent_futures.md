[TOC]

---


## 【博文摘录】[Manage Pools of Concurrent Tasks](https://pymotw.com/3/concurrent.futures/)


> - `Executors` are used for managing pools of workers, and `futures` are used for managing results computed by the workers.

> - Various APIs are provided to make it convenient to wait for tasks to complete, so that the `Future` objects do not need to be managed directly.

## 【博文摘录】[A QUICK INTRODUCTION TO THE CONCURRENT.FUTURES MODULE](http://masnun.com/2016/03/29/python-a-quick-introduction-to-the-concurrent-futures-module.html)

**Executors**

This module features the `Executor` class which is an abstract class and it can not be used directly. However it has two very useful concrete subclasses – `ThreadPoolExecutor` and `ProcessPoolExecutor`. 

**ThreadPoolExecutor**

Let’s first see some codes:

```py
from concurrent.futures import ThreadPoolExecutor
from time import sleep

def return_after_5_secs(message):
    sleep(5)
    return message

pool = ThreadPoolExecutor(3)

future = pool.submit(return_after_5_secs, ("hello"))
print(future.done()) #False
sleep(5)
print(future.done()) #True
print(future.result())
```


**ProcessPoolExecutor**

The process pool executor has a very similar API. So let’s modify our previous example and use ProcessPool instead:

```py
from concurrent.futures import ProcessPoolExecutor
from time import sleep

def return_after_5_secs(message):
    sleep(5)
    return message

pool = ProcessPoolExecutor(3)

future = pool.submit(return_after_5_secs, ("hello"))
print(future.done())
sleep(5)
print(future.done())
print("Result: " + future.result())
```

- use the `ProcessPoolExecutor` for CPU intensive tasks. 
- The `ThreadPoolExecutor` is better suited for network operations or I/O.

we must remember that the `ProcessPoolExecutor` uses the `multiprocessing` module and is not affected by the Global Interpreter Lock. However, we can not use any objects that is not picklable. So we need to carefully choose what we use/return inside the callable passed to process pool executor.


**Executor.map()**

Here’s the `ThreadPoolExample` from the official docs:

```py
import concurrent.futures
import urllib.request

URLS = ['http://www.foxnews.com/',
        'http://www.cnn.com/',
        'http://europe.wsj.com/',
        'http://www.bbc.co.uk/',
        'http://some-made-up-domain.com/']

# Retrieve a single page and report the url and contents
def load_url(url, timeout):
    with urllib.request.urlopen(url, timeout=timeout) as conn:
        return conn.read()

# We can use a with statement to ensure threads are cleaned up promptly
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
    # Start the load operations and mark each future with its URL
    future_to_url = {executor.submit(load_url, url, 60): url for url in URLS}
    for future in concurrent.futures.as_completed(future_to_url):
        url = future_to_url[future]
        try:
            data = future.result()
        except Exception as exc:
            print('%r generated an exception: %s' % (url, exc))
        else:
            print('%r page is %d bytes' % (url, len(data)))
```

And the `ProcessPoolExecutor` example:

```py
import concurrent.futures
import math

PRIMES = [
    112272535095293,
    112582705942171,
    112272535095293,
    115280095190773,
    115797848077099,
    1099726899285419]

def is_prime(n):
    if n % 2 == 0:
        return False

    sqrt_n = int(math.floor(math.sqrt(n)))
    for i in range(3, sqrt_n + 1, 2):
        if n % i == 0:
            return False
    return True

def main():
    with concurrent.futures.ProcessPoolExecutor() as executor:
        for number, prime in zip(PRIMES, executor.map(is_prime, PRIMES)):
            print('%d is prime: %s' % (number, prime))

if __name__ == '__main__':
    main()
```

**as_completed() & wait()**

The `concurrent.futures` module has two functions for dealing with the futures returned by the executors. One is `as_completed()` and the other one is `wait()`.

The `as_completed()` function takes an iterable of Future objects and starts yielding values as soon as the futures start resolving. The main difference between the aforementioned `map` method with `as_completed` is that `map` returns the results in the order in which we pass the iterables. That is the first result from the `map` method is the result for the first item. On the other hand, the first result from the `as_completed` function is from whichever future completed first.

*as_completed()*

```py
from concurrent.futures import ThreadPoolExecutor, wait, as_completed
from time import sleep
from random import randint

def return_after_5_secs(num):
    sleep(randint(1, 5))
    return "Return of {}".format(num)

pool = ThreadPoolExecutor(5)
futures = []
for x in range(5):
    futures.append(pool.submit(return_after_5_secs, x))

for x in as_completed(futures):
    print(x.result()) # 先执行完的先输出
```

*wait()*

The `wait()` function would return a named tuple which contains two set – one set contains the futures which completed (either got result or exception) and the other set containing the ones which didn’t complete.

We can see an example here:

```py
from concurrent.futures import ThreadPoolExecutor, wait, as_completed
from time import sleep
from random import randint

def return_after_5_secs(num):
    sleep(randint(1, 5))
    return "Return of {}".format(num)

pool = ThreadPoolExecutor(5)
futures = []
for x in range(5):
    futures.append(pool.submit(return_after_5_secs, x))

print(wait(futures))
```

We can control the behavior of the `wait` function by defining when it should return. We can pass one of these values to the `return_when` param of the function: `FIRST_COMPLETED`, `FIRST_EXCEPTION` and `ALL_COMPLETED`. By default, it’s set to `ALL_COMPLETED`, so the wait function returns only when all futures complete. But using that parameter, we can choose to return when the first future completes or first exception encounters.

