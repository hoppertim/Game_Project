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

KEY_W = 87
KEY_A = 65
KEY_S = 83
KEY_D = 68
KEY_E = 69
KEY_SPACE = 32

from tornado.options import define, options, parse_command_line

define("port", default=8888, help="run on the given port", type=int)


class Player(object):
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
        self.pos_change['dx'] = 0
        self.pos_change['dy'] = 0

        if self.up is True and self.down is not True:
            self.pos_change['dy'] = -2
        elif self.up is True and self.down is not True:
            self.pos_change['dy'] = 2

        if self.left is True and self.right is not True:
            self.pos_change['dx'] = -2
        elif self.right is True and self.left is not True:
            self.pos_change['dx'] = 2

        if self.pos_change['dx'] is not 0 and self.pos_change['dy'] is not 0:
            self.pos_change['dx'] *= math.sqrt(2)/2
            self.pos_change['dy'] *= math.sqrt(2)/2

        if self.sprint is True:
            self.pos_change['dx'] *= 1.7
            self.pos_change['dy'] *= 1.7

    def aim_weapon(self, x, y):
        self.aim['x'] = x
        self.aim['y'] = y
        diff_x = self.aim['x'] - self.position['x']
        diff_y = self.aim['y'] - self.position['y']

        if math.fabs(diff_x) > math.fabs(diff_y):
            if diff_x > 0:
                self.direction = 'east'
                self.image_num = 2
            else:
                self.direction = 'west'
                self.image_num = 1
        else:
            if diff_y < 0:
                self.direction = 'west'
                self.image_num = 0
            else:
                self.direction = 'north'
                self.image_num = 3

    def shoot(self, game):  # 1's are used again here for player width and height, for same reason as above
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
        elif self.direction is 'down':  # FIXME dunno if this is an error, but down not specified. Need to implement
            player_x = player_x
            player_y = player_y

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

        bullet = Bullet(
            player_x,
            player_y,
            dx * equipped_gun['speed'],
            dy * equipped_gun['speed'],
            equipped_gun['damage']
        )

        game.bullets.append(bullet)

    def toggle_weapon(self):
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


class Enemy(object):
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
        if self.direction == 'north' or self.direction == 'south':
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
        self.distance_interval = None  # TODO to be defined
        super(Heavy, self).__init__()

    def left_bound(self):  # TODO to be defined
        return None

    def right_bound(self):
        return None

    def top_bound(self):
        return None

    def bottom_bound(self):
        return None


class Bullet(object):
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


class Game(object):
    """Structure that holds the state of a given game"""
    """class TimerClass(threading.Thread):  # This may be used for doing things in intervals, but don't know yet
        def __init__(self):
            threading.Thread.__init__(self)
            self.event = threading.Event()

        def run(self):
            while not self.event.is_set():
                pass #set some kind of interval boolean? or call timed functions?

        def stop(self):
            self.event.set()"""

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

            if num <= 1:
                self.enemies.append(GridBug(-1, 0, hp_multiplier))
            elif num <= 1.5:
                self.enemies.append(Roller(-1, 0, hp_multiplier))
            else:
                self.enemies.append(GridBug(-1, 0, hp_multiplier))  # TODO include Heavy instead

    def spawn_enemies(self, amount, index):  # TODO Simplify this function to just spawn all enemies at once
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
                    starting_x = self.play_area['width'] - 1 - random.random() * 25  # 1 is placeholder for image size
                    starting_y = random.random() * self.play_area['height']
            else:
                if random.random() <= 0.5:
                    starting_x = random.random() * self.play_area['width']
                    starting_y = random.random() * 25
                else:
                    starting_x = random.random() * self.play_area['width']
                    starting_y = self.play_area['height'] - 1 - random.random() * 25  # 1 is placeholder for image size

            enemy = self.enemies[index + 1]
            index += 1
            enemy.position['x'] = starting_x
            enemy.position['y'] = starting_y

    def move_player(self, player, time_diff):  # 1's are player width and height, since I don't know how to get those
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
            # TODO update_enemy_img(enemy)

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
                if self.check_collision(bullet, enemy) is True:
                    self.bullets.remove(bullet)
                    if enemy.health <= 0:
                        self.enemies.remove(enemy)
                    return False
        return True

    def check_collision(self, object1, object2):
        if object1.left_bound() < object2.right_bound() \
                and object1.right_bound() > object2.left_bound() \
                and object1.top_bound() < object2.bottom_bound() \
                and object1.bottom_bound() > object2.top_bound():
            self.collide_process(object1, object2)
            return True
        else:
            return False

    def collide_process(self, object1, object2):
        if isinstance(object1, Player) and isinstance(object2, Enemy):
            object1.health -= 1
        elif isinstance(object1, Enemy) and isinstance(object2, Player):
            object2.health -= 1
        elif isinstance(object1, Bullet) and isinstance(object2, Enemy):
            if isinstance(object2, GridBug) or isinstance(object2, Roller) or isinstance(object2, Heavy):
                object2.health -= object1.strength
            object2.hit = True
        elif isinstance(object1, Enemy) and isinstance(object2, Bullet):
            if isinstance(object1, GridBug) or isinstance(object1, Roller) or isinstance(object1, Heavy):
                object1.health -= object2.strength
            object1.hit = True

    def update(self, time_diff):
        self.move_player(self.player1, time_diff)
        self.move_player(self.player2, time_diff)

        for bullet in self.bullets:
            self.move_bullet(bullet, time_diff)

        for enemy in self.enemies:
            enemy.closest_player(self.player1, self.player2)
            self.move_enemy(enemy, time_diff)
            if enemy.hit is True:
                enemy.hit = False


class IndexHandler(tornado.web.RequestHandler):
    @tornado.web.asynchronous
    def get(request):
        request.render('index.html')


class WebSocketGameHandler(tornado.websocket.WebSocketHandler):
    clients = []
    game = Game()
    client_id = 0
    clients_started = 0

    initial_state_1p = dict(
        message='singlePlayerGame',
        gameState=dict(
            player=dict(x=game.player1.position['x'], y=game.player1.position['y'])
        )
    )

    initial_state_2p = dict(
        message='twoPlayerGame',
        gameState=dict(
            player=dict(x=game.player1.position['x'], y=game.player1.position['y']),
            otherPlayer=dict(x=game.player2.position['x'], y=game.player2.position['y'])
        )
    )

    update_state = dict(
        message='updateState',
        gameState=dict(
            enemyData=[],
            bulletData=[],
            playerData=[],
            otherPlayerData=[]
        )
    )

    def open(self, *args):
        print('open', 'WebSocketGameHandler')
        WebSocketGameHandler.clients.append(self)
        client_id = len(WebSocketGameHandler.clients)
        set_client_id = dict(
            clientId=self.client_id
        )
        scid = json.dumps(set_client_id)
        WebSocketGameHandler.clients[client_id].write_message(scid)

    def on_message(self, message):
        print message

        in_msg = json.loads(message)

        if in_msg['message'] is 'singlePlayerGame':
            out_msg = json.dumps(self.initial_state_1p)
            self.write_message(out_msg)
        elif in_msg['message'] is 'twoPlayerGame':
            self.clients_started += 1
            while len(self.clients) != 2 and self.clients_started != 2:
                pass
            out_msg = json.dumps(self.initial_state_2p)
            self.write_message(out_msg)
        elif in_msg['message'] is 'mousedown':
            if in_msg['client_id'] is 1:
                self.game.player1.shoot(self.game)
            else:
                self.game.player2.shoot(self.game)
        elif in_msg['message'] is 'mouseup':
            pass
        elif in_msg['message'] is 'mousemove':
            if in_msg['client_id'] is 1:
                self.game.player1.aim_weapon(in_msg['x'], in_msg['y'])
            elif in_msg['client_id'] is 2:
                self.game.player2.aim_weapon(in_msg['x'], in_msg['y'])
        elif in_msg['message'] is 'keydown':
            if in_msg['client_id'] is 1:
                if in_msg['key_code'] is KEY_W:
                    self.game.player1.up = True
                elif in_msg['key_code'] is KEY_A:
                    self.game.player1.left = True
                elif in_msg['key_code'] is KEY_S:
                    self.game.player1.down = True
                elif in_msg['key_code'] is KEY_D:
                    self.game.player1.right = True
                elif in_msg['key_code'] is KEY_E:
                    if self.game.player1.pistol_equipped is True:
                        self.game.player1.pistol_equipped = False
                    else:
                        self.game.player1.pistol_equipped = True
                elif in_msg['key_code'] is KEY_SPACE:
                    self.game.player1.sprint = True
            elif in_msg['client_id'] is 2:
                if in_msg['key_code'] is KEY_W:
                    self.game.player2.up = True
                elif in_msg['key_code'] is KEY_A:
                    self.game.player2.left = True
                elif in_msg['key_code'] is KEY_S:
                    self.game.player2.down = True
                elif in_msg['key_code'] is KEY_D:
                    self.game.player2.right = True
                elif in_msg['key_code'] is KEY_E:
                    if self.game.player2.pistol_equipped is True:
                        self.game.player2.pistol_equipped = False
                    else:
                        self.game.player2.pistol_equipped = True
                elif in_msg['key_code'] is KEY_SPACE:
                    self.game.player2.sprint = True
        elif in_msg['message'] is 'keyup':
            if in_msg['client_id'] is 1:
                if in_msg['key_code'] is KEY_W:
                    self.game.player1.up = False
                elif in_msg['key_code'] is KEY_A:
                    self.game.player1.left = False
                elif in_msg['key_code'] is KEY_S:
                    self.game.player1.down = False
                elif in_msg['key_code'] is KEY_D:
                    self.game.player1.right = False
                elif in_msg['key_code'] is KEY_SPACE:
                    self.game.player1.sprint = False
            elif in_msg['client_id'] is 2:
                if in_msg['key_code'] is KEY_W:
                    self.game.player2.up = False
                elif in_msg['key_code'] is KEY_A:
                    self.game.player2.left = False
                elif in_msg['key_code'] is KEY_S:
                    self.game.player2.down = False
                elif in_msg['key_code'] is KEY_D:
                    self.game.player2.right = False
                elif in_msg['key_code'] is KEY_SPACE:
                    self.game.player2.sprint = False
        elif in_msg['message'] is 'update': # TODO finish
            pass
            #fill update_state dictionary with current state
            #send current state to client
            #update current state


    def on_close(self):
        WebSocketGameHandler.clients.remove(self)

settings = {
    'static_path': os.path.join(os.path.dirname(__file__), 'static')
}

app = tornado.web.Application([  # all StaticFileHandler stuff will need to be accessed via URL from the HTML
    (r'/game', WebSocketGameHandler),
    (r'/', IndexHandler),
    (r'/JS/(jquery-2\.1\.0\.min\.js)', tornado.web.StaticFileHandler, dict(path=settings['static_path'])),
    (r'/JS/(kinetic-v5\.0\.1\.min\.js)', tornado.web.StaticFileHandler, dict(path=settings['static_path'])),
    (r'/JS/(underscore-min\.js)', tornado.web.StaticFileHandler, dict(path=settings['static_path'])),
    (r'/CSS/(main\.css)', tornado.web.StaticFileHandler, dict(path=settings['static_path'])),
    (r'/CSS/(normalize\.css)', tornado.web.StaticFileHandler, dict(path=settings['static_path'])),
    (r'/CSS/(style\.css)', tornado.web.StaticFileHandler, dict(path=settings['static_path'])),
    # create static paths to all images as well
], **settings)

# Possible alternate solution to app instantiation:
"""
handlers = [
    (r'/game', WebSocketGameHandler),
    (r'/', IndexHandler),
    (r'/JS/(jquery-2\.1\.0\.min\.js)', tornado.web.StaticFileHandler, dict(path=settings['static_path'])),
    (r'/JS/(kinetic-v5\.0\.1\.min\.js)', tornado.web.StaticFileHandler, dict(path=settings['static_path'])),
    (r'/JS/(underscore-min\.js)', tornado.web.StaticFileHandler, dict(path=settings['static_path'])),
    (r'/CSS/(main\.css)', tornado.web.StaticFileHandler, dict(path=settings['static_path'])),
    (r'/CSS/(normalize\.css)', tornado.web.StaticFileHandler, dict(path=settings['static_path'])),
    (r'/CSS/(style\.css)', tornado.web.StaticFileHandler, dict(path=settings['static_path']))
    # static paths for images
]

app = tornado.web.Application(handlers)
"""
if __name__ == '__main__':
    parse_command_line()
    app.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()