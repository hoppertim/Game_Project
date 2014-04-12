__author__ = 'jtgoen'

import random
import math

class Enemy(object):
    """Base class for structure that holds enemy data"""
    def __init__(self):
        self.position = dict(x=0, y=0)
        self.pos_change = dict(dx=0, dy=0)
        self.direction = 'north'
        self.hit = False
        self.was_hit = False
        self.img_num = 0
        self.speed = 0
        self.distance = 0
        self.attack_wait = 0
        self.damage_interval = 0
        self.image_wait = 0
        self.image_interval = 0
        self.strength = 1

    def closest_player(self, player1, player2):
        """Logic for determining which player the enemy will target"""
        diff_x1 = player1.position['x'] - self.position['x']
        diff_y1 = player1.position['y'] - self.position['y']

        dist1 = math.sqrt(diff_x1**2 + diff_y1**2)

        diff_x2 = player2.position['x'] - self.position['x']
        diff_y2 = player2.position['y'] - self.position['y']

        dist2 = math.sqrt(diff_x2**2 + diff_y2**2)

        if dist1 <= dist2:
            self.distance = dist1
            self.pos_change['dx'] = diff_x1 / self.distance * self.speed
            self.pos_change['dy'] = diff_y1 / self.distance * self.speed
        else:
            self.distance = dist2
            self.pos_change['dx'] = diff_x2 / self.distance * self.speed
            self.pos_change['dy'] = diff_y2 / self.distance * self.speed

        if type(self) is GridBug:
            if self.pos_change['dx'] > 0:
                self.direction = 'east'
            else:
                self.direction = 'west'
        elif type(self) is Roller:
            if math.fabs(self.pos_change['dx']) > math.fabs(self.pos_change['dy']):
                if self.pos_change['dx'] > 0:
                    self.direction = 'east'
                else:
                    self.direction = 'west'
            else:
                if self.pos_change['dy'] > 0:
                    self.direction = 'north'
                else:
                    self.direction = 'south'


class GridBug(Enemy):
    """Derived class that holds data for gridBug enemies"""
    def __init__(self, x, y, hp_multiplier):
        super(GridBug, self).__init__()
        self.position['x'] = x
        self.position['y'] = y
        self.health = 10 * hp_multiplier
        self.speed = 0.7 + random.random() * 0.5
        self.distance_interval = 10
        self.damage_interval = 20
        self.image_interval = 20
        self.strength = 2

    def left_bound(self):
        return self.position['x'] + 23

    def right_bound(self):
        return self.position['x'] + 39

    def top_bound(self):
        return self.position['y'] + 26

    def bottom_bound(self):
        return self.position['y'] + 37

    def update_image(self):
        """Set the image to be displayed during a frame"""
        #image_num = self.img_num

        if self.direction == 'east':
            if self.img_num < 2:
                pass
            else:
                self.img_num -= 2
        elif self.direction == 'west':
            if self.img_num > 2:
                pass
            else:
                self.img_num += 2

        if self.hit is True:
            self.img_num += 4

        if self.was_hit is True:
            self.img_num.__init__()


class Roller(Enemy):
    """Derived class that holds data for roller enemies"""
    def __init__(self, x, y, hp_multiplier):
        super(Roller, self).__init__()
        self.position['x'] = x
        self.position['y'] = y
        self.health = 6 * hp_multiplier
        self.speed = 1.7 + random.random() * 0.6
        self.distance_interval = 15
        self.damage_interval = 15
        self.image_interval = 15

    def left_bound(self):
        if self.direction == 'north' or self.direction == 'south':
            return self.position['x'] + 25
        else:
            return self.position['x'] + 19

    def right_bound(self):
        if self.direction == 'north' or self.direction == 'south':
            return self.position['x'] + 38
        else:
            return self.position['x'] + 44

    def top_bound(self):
        if self.direction == 'north' or self.direction == 'south':
            return self.position['y'] + 24
        else:
            return self.position['y'] + 25

    def bottom_bound(self):
        if self.direction == 'north' or self.direction == 'south':
            return self.position['y'] + 38
        else:
            return self.position['y'] + 36

    def update_image(self):
        """ TODO This is not going to work since it increases the imgNum every time without resetting it
        Set the image to be displayed during a frame"""

        if self.direction == 'east':
            if self.img_num < 2:
                pass
            else:
                self.img_num.__init__()
        elif self.direction == 'west':
            if 2 < self.img_num < 4:
                pass
            else:
                self.img_num.__init__()
                self.img_num += 2
        elif self.direction == 'north':
            if 4 < self.img_num < 6:
                pass
            else:
                self.img_num.__init__()
                self.img_num += 4
        elif self.direction == 'south':
            if 6 < self.img_num < 8:
                pass
            else:
                self.img_num.__init__()
                self.img_num += 6

        if self.hit is True:
            self.img_num += 8

        if self.was_hit is True:
            self.img_num.__init__()


class Heavy(Enemy):
    """Derived class that holds data for heavy enemies"""
    def __init__(self, x, y, hp_multiplier):
        super(Heavy, self).__init__()
        self.position['x'] = x
        self.position['y'] = y
        self.health = 40 * hp_multiplier
        self.speed = 0.2 + random.random() * 0.5
        self.distance_interval = None  # TODO to be defined
        self.damage_interval = 25
        self.image_interval = 25
        self.strength = 5

    def left_bound(self):  # TODO to be defined
        return None

    def right_bound(self):
        return None

    def top_bound(self):
        return None

    def bottom_bound(self):
        return None