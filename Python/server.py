__author__ = 'John Goen'

import tornado.ioloop
import tornado.web
import tornado.websocket
import json
import os
import random
import math
import threading
import time

from tornado.options import define, options, parse_command_line

define("port", default=8888, help="run on the given port", type=int)


class Client:
    thing = "stuff"


class Game:
    """Structure that holds the state of a given game"""
    """class TimerClass(threading.Thread): #This may be used for doing things in intervals, but don't know yet
        def __init__(self):
            threading.Thread.__init__(self)
            self.event = threading.Event()

        def run(self):
            while not self.event.is_set():
                Game.spawn_enemies(15, 5000, )"""

    def __init__(self):
        self.play_area = dict(width=1000, height=600)
        self.player1 = Player()
        self.player2 = Player()
        self.bullets = []
        self.enemies = []
        self.level_complete = False
        self.level_number = 1

    def populate_enemies(self):
        hp_multiplier = 1
        for i in range(0, 50 * self.level_number):
            num = random.random() * 2
            type = None

            if num <= 1:
                self.enemies.append(GridBug(-1, 0, hp_multiplier))
            elif num <= 1.5:
                self.enemies.append(Roller(-1, 0, hp_multiplier))
            else:
                self.enemies.append(GridBug(-1, 0, hp_multiplier)) #TODO include Heavy instead

    def spawn_enemies(self, amount, time_interval, index): #WTF is index?
        if index is None:
            index = 0

        if index + amount >= len(self.enemies):
            amount = len(self.enemies) - index

        for i in amount:
            starting_x = None
            starting_y = None

            if random.random() <= 0.5:
                if random.random() <= 0.5:
                    starting_x = random.random() * 25
                    starting_y = random.random() * self.play_area['height']
                else:
                    starting_x = self.play_area['width'] - 1 - random.random() * 25 #1 used as placeholder for image size
                    starting_y = random.random() * self.play_area['height']
            else:
                if random.random() <= 0.5:
                    starting_x = random.random() * self.play_area['width']
                    starting_y = random.random() * 25
                else:
                    starting_x = random.random() * self.play_area['width']
                    starting_y = self.play_area['height'] - 1 - random.random() * 25 #1 used as placeholder for image size

            enemy = self.enemies[index + 1]
            index += 1
            enemy.position['x'] = starting_x
            enemy.position['y'] = starting_y

        if index < len(self.enemies) - 1: #need a way to spawn on interval
            things = None

    def move_player(self, player, time_diff): #1's are for player width and height, since I don't know how to get those
        player_x = player.position['x']
        player_y = player.position['y']

        if self.play_area['width'] - 5 - 1 - player.pos_change['dx'] \
                >= player_x >= 5 - player.pos_change['dx']:
            diff_x = player.pos_change['dx'] * time_diff / 20
            x_pos = player_x + diff_x
            player.position['x'] = x_pos

        if self.play_area['height'] - 5 - 1 - player.pos_change['dy'] \
                >= player_y >= 5 - player.pos_change['dy']:
            diff_y = player.pos_change['dy'] * time_diff / 20
            y_pos = player_y + diff_y
            player.position['y'] = y_pos

    def move_enemy(self, enemy, time_diff):
        enemy.position['x'] += enemy.pos_change['dx'] * time_diff / 20
        enemy.position['y'] += enemy.pos_change['dy'] * time_diff / 20
        enemy.distance += enemy.speed * time_diff / 20
        if enemy.distance > enemy.distance_interval:
            enemy.distance -= enemy.distance_interval
            enemy.img_num = (enemy.img_num + 1) % 2
            #update_enemy_img(enemy)

    def move_bullet(self, bullet, time_diff):
        start_x = bullet.position['x']
        start_y = bullet.position['y']
        diff_x = bullet.pos_change['x'] * time_diff / 20
        diff_y = bullet.pos_change['y'] * time_diff / 20
        end_x = start_x + diff_x
        end_y = start_y + diff_y

        bullet.position['x'] = end_x
        bullet.position['y'] = end_y

        if bullet.position['x'] > self.play_area['width'] + 2 \
                or bullet.position['x'] < -2 \
                or bullet.position['y'] > self.play_area['height'] + 2 \
                or bullet.position['y'] < -2:
            self.bullets.remove(bullet)
        else:
            for enemy in self.enemies:
                if self.check_collision(bullet, enemy):
                    self.bullets.remove(bullet)
                    if enemy.health <= 0:
                        self.enemies.remove(enemy)

    def check_collision(self, object1, object2): #TODO will impement last
        return None

    def collide_process(self, object1, object2): #TODO will implement last
        return None


class Player:
    """Structure that holds player data"""
    def __init__(self):
        self.position = dict(x=0, y=0)
        self.health = 3
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

    def shoot(self, game): #1's are used again here for player width and height, for same reason as above
        if self.sprint is True \
                or (self.ready is not True and self.pistol_equipped is not True):
            return
        player_x = self.position['x'] + 1 / 2
        player_y = self.position['y'] + 1 / 2

        if self.direction is 'up':
            player_x += 1
            player_y -= 18
        elif self.direction is 'left':
            player_x -= 9
            player_y -= 5
        elif self.direction is 'right':
            player_x += 10
            player_y -= 5
        elif self.direction is 'down': #FIXME dunno if this is an error, but down was not specified before
            player_x = player_x
            player_y = player_y

        diff_x = self.aim['x'] - player_x
        diff_y = self.aim['y'] - player_y
        speed = math.sqrt(diff_x**2 + diff_y**2)
        dx = 1 * diff_x / speed
        dy = 1 * diff_y / speed
        gun = None

        if self.pistol_equipped is True:
            gun = self.pistol
        else:
            gun = self.gun

        bullet = Bullet(player_x, player_y, dx * gun['speed'], \
                        dy * gun['speed'], gun['damage'])
        game.bullets.append(bullet)

    def toggle_weapon(self):
        self.pistol_equipped = not self.pistol_equipped
        #don't know if interval is relevant to this server code

    def left_bound(self):
        return self.position['x'] + 26

    def right_bound(self):
        return self.position['x'] + 36

    def top_bound(self):
        return self.position['y'] + 26

    def bottom_bound(self):
        return self.position['y'] + 36


class Enemy:
    """Base class for structure that holds enemy data"""
    def __init__(self):
        self.position = dict(x=0, y=0)
        self.pos_change = dict(dx=0, dy=0)
        self.direction = 'north'
        self.hit = False
        self.img_num = 0
        self.distance = 0

    def closest_player(self, player1, player2):
        diff_x1 = math.fabs(self.position['x'] - player1.position['x'])
        diff_y1 = math.fabs(self.position['y'] - player1.position['y'])

        dist1 = math.sqrt(diff_x1**2 + diff_y1**2)

        diff_x2 = math.fabs(self.position['x'] - player2.position['x'])
        diff_y2 = math.fabs(self.position['y'] - player2.position['y'])

        dist2 = math.sqrt(diff_x2**2 + diff_y2**2)

        if dist1 >= dist2:
            return player1
        else:
            return player2




class GridBug(Enemy):
    """Derived class that holds data for gridBug enemies"""
    def __init__(self, x, y, hp_multiplier):
        self.health = 10 * hp_multiplier
        self.speed = 0.7 * random.random() * 0.5
        self.distance_interval = 10
        super(GridBug, self).__init__()

    def left_bound(self):
        return self.position['x'] + 23

    def right_bound(self):
        return self.position['x'] + 39

    def top_bound(self):
        return self.position['y'] + 26

    def bottom_bound(self):
        return self.position['y'] + 37


class Roller(Enemy):
    """Derived class that holds data for roller enemies"""
    def __init__(self, x, y, hp_multiplier):
        self.health = 6 * hp_multiplier
        self.speed = 1.7 * random.random() * 0.6
        self.distance_interval = 15
        super(Roller, self).__init__()

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
        if Enemy.direction == 'north' or self.direction == 'south':
            return self.position['x'] + 24
        else:
            return self.position['x'] + 25

    def bottom_bound(self):
        if self.direction == 'north' or self.direction == 'south':
            return self.position['x'] + 38
        else:
            return self.position['x'] + 36


class Heavy(Enemy):
    """Derived class that holds data for heavy enemies"""
    def __init__(self, hp_multiplier):
        self.health = 40 * hp_multiplier
        self.speed = 0.2 * random.random() * 0.5
        self.distance_interval = None #TODO to be defined
        super(Heavy, self).__init__()

    def left_bound(self): #TODO to be defined
        return None

    def right_bound(self):
        return None

    def top_bound(self):
        return None

    def bottom_bound(self):
        return None


class Bullet:
    def __init__(self, xpos, ypos, dx, dy, damage):
        self.position = dict(x=xpos, y=ypos)
        self.pos_change = dict(dx=dx, dy=dy)
        self.strength = damage

    def left_bound(self):
        return self.position['x'] - 2

    def right_bound(self):
        return self.position['x'] + 2

    def top_bound(self):
        return self.position['y'] - 2

    def bottom_bound(self):
        return self.position['y'] + 2


class IndexHandler(tornado.web.RequestHandler):
    @tornado.web.asynchronous
    def get(request):
        request.render('index.html')


class WebSocketGameHandler(tornado.websocket.WebSocketHandler):
    clients = []
    game = Game()
    def open(self, *args):
        print('open', 'WebSocketGameHandler')
        WebSocketGameHandler.clients.append(self)

    def on_message(self, message):
        print message

        if message == 'start2pGame':
            while len(WebSocketGameHandler.clients) != 2:
                pass #show waiting for player screen.
            #add client to game
            #start the game
        elif message == "quit":
            print message
            #Set the player's screen to main screen
            #remove the player from the game
            #reset game state to default
        else:
            msg = json.loads(message)

            if msg['id'] == 'inGame':
                if msg['action'] == 'down':
                    if msg['playerId'] == 1:
                        print message  #do stuff CHANGE THIS TO ACTUAL IMPLEMENTATION
            elif msg['id'] == 'inPurchaseMenu':
                print message  #do stuff CHANGE THIS TO ACTUAL IMPLEMENTATION
            else:
                print "Error: JSON Message ID is invalid."

    def on_close(self):
        WebSocketGameHandler.clients.remove(self)

settings = {
    'static_path': os.path.join(os.path.dirname(__file__), 'static')
}

app = tornado.web.Application([ #all StaticFileHandler stuff will need to be accessed via URL from the HTML
    (r'/game', WebSocketGameHandler),
    (r'/', IndexHandler),
    (r'/JS/(jquery-2\.1\.0\.min\.js)', tornado.web.StaticFileHandler, dict(path=settings['static_path'])),
    (r'/JS/(kinetic-v5\.0\.1\.min\.js)', tornado.web.StaticFileHandler, dict(path=settings['static_path'])),
    (r'/JS/(underscore-min\.js)', tornado.web.StaticFileHandler, dict(path=settings['static_path'])),
    (r'/CSS/(main\.css)', tornado.web.StaticFileHandler, dict(path=settings['static_path'])),
    (r'/CSS/(normalize\.css)', tornado.web.StaticFileHandler, dict(path=settings['static_path'])),
    (r'/CSS/(style\.css)', tornado.web.StaticFileHandler, dict(path=settings['static_path'])),
], **settings)

if __name__ == '__main__':
    parse_command_line()
    app.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()