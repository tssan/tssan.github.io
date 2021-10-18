Title: 2d map generator in Python
Summary: How to build generator that creates 2d maps with rectangle shaped rooms. Saving map data into file and creating preview.
Date: 2018-10-30
Tags: gamedev, python
Status: published


# Constraints and objectives

The main goal of this article is to show, how to build a tool that can produce 2d map in a reusable structure. This topic is new to me so I did some research. I found a pretty easy and stright-forward alghoritm - binary space partitioning (BSP). It turns out that BSP alghoritm is often used in game development. First search hit was [gamedev.stackexchange.com](https://gamedev.stackexchange.com/questions/82059/algorithm-for-procedureral-2d-map-with-connected-paths){:target="_blank"}. I founded examples that meet my expectations and are close enough to help me achive my goal which is randomized 2d map. Maybe after this little project I will try other alghoritms to create some irregular shaped maps, we will see how it goes. The programming language for this task will be Python.

Let's make a TODO list:

* store map in text file with some kind of 2 dimenssional array
* the map is built of two elements: rooms (rectangles) and paths (lines)
* generator should be parameterized:
    * width and height of the map where 1 unit is a square tile that later on can be defined as you wish
    * minimal room's wall size
    * minimal ratio of room's width and height
    * minimal area of the room regarding splited area
    * number of splits (for BSP)
    * (*) free space between rooms (padding)
* (*) make a map preview, eg. as PNG image

(*) options are optional

> You can get complete code for this tutorial on my github [here](https://github.com/tssan/rand2dmap){:target="_blank"}.

# Map file & data structure

Map is a container for square tiles. In this project we will have 3 types of tiles:

* wall - represented by "0"
* room - "1"
* path = "2"

Example of 10x10 map with 2 rooms and single path:

```txt
// sample.map

0000000000
0111100000
0111100000
0111100000
0002000000
0002000000
0011111110
0011111110
0011111110
0000000000
```

In code this data will be 2-dimensional array:

```python
MAP_ARRAY = [
    ['0','0','0','0','0','0','0','0','0','0'],
    ['0','1','1','1','1','0','0','0','0','0'],
    ['0','1','1','1','1','0','0','0','0','0'],
    ['0','1','1','1','1','0','0','0','0','0'],
    ['0','0','0','2','0','0','0','0','0','0'],
    ['0','0','0','2','0','0','0','0','0','0'],
    ['0','0','1','1','1','1','1','1','1','0'],
    ['0','0','1','1','1','1','1','1','1','0'],
    ['0','0','1','1','1','1','1','1','1','0'],
    ['0','0','0','0','0','0','0','0','0','0']
]
```

# BSP algorithm

I will simplify the definition of this algorithm by limiting it to our particular problem. We want to randomly split a rectangle area. Then we split these 2 rectangles the same way as in the previous step and so on... until number of splits will be achieved. To understand it better look at images below.

[![BSP algorithm](/images/split.png)](/images/split.png){:target="_blank"}

To implement this idea we need a data structure that will hold all informations about splitted rectangles. Binary tree for the rescue! Let's define base classes.

```python
# tree.py

class Node:
    def __init__(self, data, left=None, right=None):
        self.data = data
        self.left = left
        self.right = right


class Rect:
    def __init__(self, x, y, width, height):
        self.x = x
        self.y = y
        self.width = width
        self.height = height
```

A word of explanation here. Node's attribute `data` in our case will be a type of `Rect` class. Ok! What now..? For sure we will need a function that randomly splits a `Rect` object into 2. Python's standard library `random` will be helpful here.

```python
# tree.py

from random import randint


def split_rect(rect):
    if randint(0, 1) == 0:  # split vertical
        r1 = Rect(
            rect.x, rect.y,
            randint(1, rect.width), rect.height
        )
        r2 = Rect(
            rect.x + r1.width, rect.y,
            rect.width - r1.width, rect.height
        )
    else:  # split horizontal
        r1 = Rect(
            rect.x, rect.y,
            rect.width, randint(1, rect.height)
        )
        r2 = Rect(
            rect.x, rect.y + r1.height,
            rect.width, rect.height - r1.height
        )
    return r1, r2
```

Minimal room's wall size or padding will be added to `split_rect` function later on. Next step is to write a "split" function.

```python
def split_tree_of_rectangles(rect, step):
    tree = Node(rect)
    if step != 0:
        split = split_rect(rect)
        if split:
            tree.left = split_tree_of_rectangles(split[0], step - 1)
            tree.right = split_tree_of_rectangles(split[1], step - 1)
    return tree
```

As you can see function is simple. We recursively creating nodes until step is 0. Notice that the more splits we create the smaller the rooms will get.

# Main program

Things to do:

* set constants
* create tree of rectangles
* initialize MAP_ARRAY with zeros
* update MAP_ARRAY using tree
* save MAP_ARRAY into the file

```python
# generator.py

import os

from rand2dmap.tree import Rect, split_tree_of_rectangles


MAP_WIDTH = 100
MAP_HEIGHT = 100

SPLITS = 4

MAPS_PATH = './.maps'


wrap_rect = Rect(0, 0, MAP_WIDTH, MAP_HEIGHT)
tree = split_tree_of_rectangles(wrap_rect, SPLITS)

MAP_ARRAY = []
for y in range(0, MAP_HEIGHT):
    row = []
    for x in range(0, MAP_WIDTH):
        row.append("0")
    MAP_ARRAY.append(row)


def update_rooms(node):
    if node is None:
        return

    if node.is_leaf:
        room = node.data.room

        for x in range(room.x, room.x + room.width):
            for y in range(room.y, room.y + room.height):
                MAP_ARRAY[y][x] = "1"
    else:
        # create path between leaf's centers (nodes not rooms!)
        l1 = node.left.data
        l2 = node.right.data
        c1 = (l1.x + int(l1.width / 2), l1.y + int(l1.height / 2))
        c2 = (l2.x + int(l2.width / 2), l2.y + int(l2.height / 2))

        if c1[0] == c2[0]:
            x = c1[0]
            for y in range(c1[1], c2[1]):
                MAP_ARRAY[y][x] = "2"
        if c1[1] == c2[1]:
            y = c1[1]
            for x in range(c1[0], c2[0]):
                MAP_ARRAY[y][x] = "2"

    update_rooms(node.left)
    update_rooms(node.right)


update_rooms(tree)

new_map_path = os.path.join(MAPS_PATH, 'sample.map')
with open(new_map_path, 'w') as map_file:
    for r in MAP_ARRAY:
        for t in r:
            map_file.write(t)
        map_file.write('\n')
```

The `update_rooms` function is most interesting here. It goes through the whole tree. In our case operation we are using is called pre-order search. Inside this function we are updating `MAP_ARRAY` with data inside each node. The `room` attribute is not implemented yet. It should return a `Rect` object that holds information about position and size of the `room`. Also we are missing `is_leaf` function. Let's try implement those now.

```python
# tree.py update

class Node:
    def __init__(self, data, left=None, right=None):
        self.data = data
        self.left = left
        self.right = right

    @property
    def is_leaf(self):
        return self.left is None and self.right is None


class Rect:
    def __init__(self, x, y, width, height):
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self._room = None

    @property
    def room(self):
        if self._room is None:
            self._room = self.create_room()
        return self._room

    def create_room(self):
        x = randint(self.x, self.x + int(self.width / 2))
        y = randint(self.y, self.y + int(self.height / 2))
        width = abs(x - randint(x, self.x + self.width))
        height = abs(y - randint(y, self.y + self.height))

        return Rect(x, y, width, height)
```

Functions `room` and `is_leaf` are properties. If you are not familiar with Python property decorator then for now you should know that it allows to call method of the class without using parenthesis (check docs on [python.org](https://docs.python.org/3/library/functions.html#property){:target="_blank"} for more informations).

Let's try run this code and check the result! If you wish to see complete code for this stage go to my github [repository](https://github.com/tssan/rand2dmap){:target="_blank"} and checkout to part1 tag (`git checkout tags/part1`). As always I'm creating simple `Makefile` for basic tasks.

```makefile
# Makefile

ENV_PATH?=.env
SRC_FULL_PATH?=$(shell pwd)/src
TMP_MAPS_PATH?=.maps


.PHONY: env-setup
env-setup:
    @virtualenv -q -p python3 $(ENV_PATH);
    @mkdir -p $(TMP_MAPS_PATH)


.PHONY: clean-py
clean-py:
    @find . -name "*.pyc" -exec rm -rf {} \; -prune -print
    @find . -name "__pycache__" -exec rm -rf {} \; -prune -print


.PHONY: clean
clean:
    @rm -rf $(ENV_PATH)
    @rm -rf $(TMP_MAPS_PATH)
    @$(MAKE) clean-py


.PHONY: run
run:
    @. $(ENV_PATH)/bin/activate && PYTHONPATH=$(SRC_FULL_PATH) python src/rand2dmap/generator.py
```

After you run `make env-setup` run you should have generated map in `.maps` folder. There is a chance that you get an exception `ValueError: empty range for randrange() (1,1, 0)`. It will occurs if in any `randint` arguments will have same values. It is an edge case that we will soon fix.

# Map parameters and constraints

Let's take care of TODO list created at very beginning of this article. Starting with default options in generator.py:

```diff
# generator.py

import os

+ from rand2dmap.tree import (
+     Rect,
+     split_tree_of_rectangles,
+     SplitRectangleError
+ )
+
+ DEFAULT_OPTIONS = {
+     'padding': 1,
+     'min_wall_size': 2,
+     'min_walls_ratio': 0.4,
+     'min_area_percent': 0.3
+ }

MAP_WIDTH = 100
MAP_HEIGHT = 100

+ SPLITS = 5

MAPS_PATH = './.maps'


+ wrap_rect = Rect(0, 0, MAP_WIDTH, MAP_HEIGHT, DEFAULT_OPTIONS)
+ tree = None
+ while tree is None:
+     try:
+         tree = split_tree_of_rectangles(wrap_rect, SPLITS, DEFAULT_OPTIONS)
+     except SplitRectangleError:
+         print('.', end='')
```

I have created `SplitRectangleError` exception class. In case something goes wrong we will retry until tree instance is created.

Adding modifications to the `Rect` class.

```diff
  class Rect:
+     def __init__(self, x, y, width, height, options):
          self.x = x
          self.y = y
          self.width = width
          self.height = height
+         self.options = options
+         self._area = None
          self._room = None

+     @property
+     def area(self):
+         if self._area is None:
+             self._area = self.width * self.height
+         return self._area
+
      @property
      def room(self):
          if self._room is None:
              self._room = self.create_room()
          return self._room

      def create_room(self):
+         padding = self.options['padding']
+         min_wall_size = self.options['min_wall_size']
+         min_walls_ratio = self.options['min_walls_ratio']
+         min_area_percent = self.options['min_area_percent']
+
+         x = randint(self.x + padding, self.x + int(self.width / 2))
+         y = randint(self.y + padding, self.y + int(self.height / 2))
+
+         width = randint(min_wall_size, self.x + self.width - x)
+         height = randint(min_wall_size, self.y + self.height - y)
+
+         if (height / width < min_walls_ratio or width / height < min_walls_ratio or
+                 width * height < min_area_percent * self.area):
+             return self.create_room()
+
+         return Rect(x, y, width, height, self.options)
```

We must consider paddings while calculating room's position. If ratio of walls or area doesn't meet the conditions we return self function and try again.

Splitting rectangles we should also consider padding, `min_wall_size` and `min_walls_ratio`.

```diff
+ def split_rect(rect, options):
+     padding = options['padding']
+     min_wall_size = options['min_wall_size']
+     min_walls_ratio = options['min_walls_ratio']
+
+     min_split_size = 2 * padding + min_wall_size
+
+     # we don't want to split too small reactangle
+     if rect.width < 2 * min_split_size or rect.height < 2 * min_split_size:
+         raise SplitRectangleError()

      if randint(0, 1) == 0:  # split vertical
          r1 = Rect(
              rect.x, rect.y,
+             randint(min_split_size, rect.width), rect.height,
+             options
+         )
          r2 = Rect(
              rect.x + r1.width, rect.y,
+             rect.width - r1.width, rect.height,
+             options
+         )
+
+         # retry if ratio is too small
+         if r1.width / r1.height < min_walls_ratio or r2.width / r2.height < min_walls_ratio:
+             return split_rect(rect, options)
      else:  # split horizontal
          r1 = Rect(
              rect.x, rect.y,
+             rect.width, randint(min_split_size, rect.height),
+             options
+         )
          r2 = Rect(
              rect.x, rect.y + r1.height,
+             rect.width, rect.height - r1.height,
+             options
+         )
+
+         # retry if ratio is too small
+         if r1.height / r1.width < min_walls_ratio or r2.height / r2.width < min_walls_ratio:
+             return split_rect(rect, options)
      return r1, r2
```

Don't forget to pass `options` inside `split_tree_of_rectangles` function. Checkout to part2 tag to see all changes we made.

> A padding was missing in create_room function. It is fixed in the repository.


# Extras

It would be nice to see how generated map looks like other than in form of zeros and ones. For that task let's use `Pillow` package. Function will read `.map` file and put pixels in an array with color regarding the current value.

```python
# preview.py

import os
from PIL import Image


def rgb(tile_sign):
    if tile_sign == '0':
        return (118, 165, 204)
    if tile_sign == '1':
        return (74, 103, 127)
    if tile_sign == '2':
        return (224, 231, 255)
    return (0, 0, 0)


def create_preview(mappath, width, height, zoom=1):
    im = None
    img_data = []
    im = Image.new('RGB', (width, height))

    with open(mappath, 'r') as f:
        lines = f.readlines()
        for line in lines:
            line = list(line.strip('\n'))
            img_data = img_data + list(map(rgb, line))

    im.putdata(img_data)
    im = im.resize((int(width * zoom), int(height * zoom)), Image.ANTIALIAS)

    head, ext = os.path.splitext(mappath)
    new_img_path = '{}{}'.format(head, '.png')
    im.save(new_img_path)
```

[![Map1](/images/dung_1.png)](/images/dung_1.png){:target="_blank" class="small"}
[![Map2](/images/dung_2.png)](/images/dung_2.png){:target="_blank" class="small"}
[![Map3](/images/dung_3.png)](/images/dung_3.png){:target="_blank" class="small"}


That is much better!

I modified how the map is saved a little bit so script can save multiple maps. Check how it's done in the repository.

# Summary

Ok! The generator is done. This is certainly not an optimal way to generate that kind of map but it is good enough. There is a `RecursionError: maximum recursion depth exceeded while calling a Python object` problem that should be handled. Depends on constraints setup it occurs more or less often. I plan to write an article about how to use generated maps (probably in a game level design or other game development subject).

Thanks for reading and please leave any comment below. Cheers!
