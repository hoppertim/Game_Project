__author__ = 'jtgoen'

import math

import bullet_s


class Player(object):
    """Structure that holds player data"""
    def __init__(self, posx, posy):
        self.position = dict(x=posx, y=posy)
        self.health = 100
        self.aim = dict(x=0, y=0)
        self.money = 0
        self.up = False
        self.down = False
        self.left = False
        self.right = False
        self.down = False
        self.sprint = False
        self.direction = 'north'
        self.hit = False
        self.pos_change = dict(dx=0, dy=0)
        self.ready = True
        self.fire_interval = None
        self.pistol_equipped = True
        self.image_num = 0

        self.pistol = {
            'fire_rate': -1,
            'speed': 10,
            'damage': 1,
            'spread': 1,
            'ammo': -1,
            'rapid_fire': False
        }

        self.gun = {
            'fire_rate': 10,
            'speed': 15,
            'damage': 2,
            'spread': 1,
            'ammo': 200,
            'rapid_fire': True
        }

    def update_movement(self):
        """Set the amount and direction that a player will move in a frame"""
        self.pos_change['dx'] = 0
        self.pos_change['dy'] = 0

        if self.up is True and self.down is not True:
            #print "should move up"
            self.pos_change['dy'] = -2
        elif self.down is True and self.up is not True:
            #print "should move down"
            self.pos_change['dy'] = 2

        if self.left is True and self.right is not True:
            #print "should move left"
            self.pos_change['dx'] = -2
        elif self.right is True and self.left is not True:
            #print "should move right"
            self.pos_change['dx'] = 2

        if self.pos_change['dx'] != 0 and self.pos_change['dy'] != 0:
            self.pos_change['dx'] *= math.sqrt(2)/2
            self.pos_change['dy'] *= math.sqrt(2)/2

        if self.sprint is True:
            self.pos_change['dx'] *= 1.7
            self.pos_change['dy'] *= 1.7

    def aim_weapon(self, direction):
        """Determine what direction the player will face in a frame"""
        if direction == 'north':
            self.image_num = 0
            self.direction = 'up'
        elif direction == 'south':
            self.image_num = 3
            self.direction = 'down'
        elif direction == 'east':
            self.image_num = 2
            self.direction = 'right'
        elif direction == 'west':
            self.image_num = 1
            self.direction = 'left'

    def shoot(self, game):  # 1's are player width and height, since I don't know how to get those
        """Execute relevant computations for firing a player's weapon"""
        if self.sprint is True \
                or (self.ready is not True and self.pistol_equipped is not True):
            return
        player_x = self.position['x'] + 64 / 2
        player_y = self.position['y'] + 64 / 2

        if self.direction == 'up':
            player_x += 1
            player_y -= 18
        elif self.direction == 'left':
            player_x -= 9
            player_y -= 5
        elif self.direction == 'right':
            player_x += 10
            player_y -= 5
        elif self.direction == 'down':
            pass

        diff_x = self.aim['x'] - player_x
        diff_y = self.aim['y'] - player_y
        speed = math.sqrt(diff_x**2 + diff_y**2)
        dx = 1 * diff_x / speed
        dy = 1 * diff_y / speed
        equipped_gun = None

        if self.pistol_equipped is True:
            equipped_gun = self.pistol
        else:
            equipped_gun = self.gun

        bullet = bullet_s.Bullet(
            player_x,
            player_y,
            dx * equipped_gun['speed'],
            dy * equipped_gun['speed'],
            equipped_gun['damage']
        )

        game.bullets.append(bullet)

    def toggle_weapon(self):
        """Switches the player's active weapon"""
        self.pistol_equipped = not self.pistol_equipped
        # don't know if interval is relevant to this server code

    def left_bound(self):
        return self.position['x'] + 26

    def right_bound(self):
        return self.position['x'] + 36

    def top_bound(self):
        return self.position['y'] + 26

    def bottom_bound(self):
        return self.position['y'] + 36