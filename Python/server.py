__author__ = 'John Goen'

import tornado.ioloop
import tornado.web
import tornado.websocket
import json
import os
import random
import math

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
    def __init__(self, posx, posy):
        self.position = dict(x=posx, y=posy)
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
        """Set the amount and direction that a player will move in a frame"""
        self.pos_change['dx'] = 0
        self.pos_change['dy'] = 0

        if self.up is True and self.down is not True:
            print "should move up"
            self.pos_change['dy'] = -2
        elif self.down is True and self.up is not True:
            print "should move down"
            self.pos_change['dy'] = 2

        if self.left is True and self.right is not True:
            print "should move left"
            self.pos_change['dx'] = -2
        elif self.right is True and self.left is not True:
            print "should move right"
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

        bullet = Bullet(
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


class Enemy(object):
    """Base class for structure that holds enemy data"""
    def __init__(self):
        self.position = dict(x=0, y=0)
        self.pos_change = dict(dx=0, dy=0)
        self.direction = 'north'
        self.hit = False
        self.img_num = 0
        self.speed = 0
        self.distance = 0

    def closest_player(self, player1, player2):
        """Logic for determining which player the enemy will target"""
        diff_x1 = player1.position['x'] - self.position['x']
        diff_y1 = player1.position['y'] - self.position['y']

        dist1 = math.sqrt(diff_x1**2 + diff_y1**2)
        print str(dist1)

        diff_x2 = player2.position['x'] - self.position['x']
        diff_y2 = player2.position['y'] - self.position['y']

        dist2 = math.sqrt(diff_x2**2 + diff_y2**2)
        print str(dist2)

        #closest = player1
        if dist1 <= dist2:
            print "Approaching player 1."
            self.distance = dist1
            self.pos_change['dx'] = diff_x1 / self.distance * self.speed
            self.pos_change['dy'] = diff_y1 / self.distance * self.speed
        else:
            print "Approaching player 2."
            self.distance = dist2
            self.pos_change['dx'] = diff_x2 / self.distance * self.speed
            self.pos_change['dy'] = diff_y2 / self.distance * self.speed

        #diff_X = closest.position['x'] - self.position['x']
        #diff_Y = closest.position['y'] - self.position['x']


        #self.pos_change['dx'] = diff_X / self.distance * self.speed
        #self.pos_change['dy'] = diff_Y / self.distance * self.speed


class GridBug(Enemy):
    """Derived class that holds data for gridBug enemies"""
    def __init__(self, x, y, hp_multiplier):
        super(GridBug, self).__init__()
        self.position['x'] = x
        self.position['y'] = y
        self.health = 10 * hp_multiplier
        self.speed = 1.7 * random.random() * 0.5
        self.distance_interval = 10

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
        if self.direction == 'east':
            pass
        elif self.direction == 'west':
            self.img_num += 2
        elif self.direction == 'north':
            self.img_num += 4
        elif self.direction == 'south':
            self.img_num += 6

        if self.hit is True:
            self.img_num += 8


class Roller(Enemy):
    """Derived class that holds data for roller enemies"""
    def __init__(self, x, y, hp_multiplier):
        super(Roller, self).__init__()
        self.position['x'] = x
        self.position['y'] = y
        self.health = 6 * hp_multiplier
        self.speed = 1.7 + random.random() * 0.6
        self.distance_interval = 15

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
    	"""This is not going to work since it increases the imgNum everytime without reseting it"""
        """Set the image to be displayed during a frame"""
        if self.direction == 'east':
            pass
        elif self.direction == 'west':
            self.img_num += 2
        elif self.direction == 'north':
            self.img_num += 4
        elif self.direction == 'south':
            self.img_num += 6

        if self.hit is True:
            self.img_num += 8


class Heavy(Enemy):
    """Derived class that holds data for heavy enemies"""
    def __init__(self, x, y, hp_multiplier):
        super(Heavy, self).__init__()
        self.position['x'] = x
        self.position['y'] = y
        self.health = 40 * hp_multiplier
        self.speed = 0.2 * random.random() * 0.5
        self.distance_interval = None  # TODO to be defined

    def left_bound(self):  # TODO to be defined
        return None

    def right_bound(self):
        return None

    def top_bound(self):
        return None

    def bottom_bound(self):
        return None


class Bullet(object):
    """Structure that holds data for bullets"""
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
    def __init__(self):
        self.play_area = dict(width=1000, height=600)
        self.player1 = Player(400, 300)
        self.player2 = Player(600, 300)
        self.bullets = []
        self.enemies = []
        self.level_complete = False
        self.level_number = 1

    def populate_enemies(self):
        """Populate enemies list randomly"""
        hp_multiplier = 1
        for i in range(0, 50 * self.level_number):
        #for i in range(0, self.level_number):
            num = random.random() * 2

            if num <= 1:
                self.enemies.append(GridBug(-1, 0, hp_multiplier))
            elif num <= 1.5:
                self.enemies.append(Roller(-1, 0, hp_multiplier))
            else:
                self.enemies.append(GridBug(-1, 0, hp_multiplier))  # TODO include Heavy instead

    def spawn_enemies(self):
        """Set enemy positions on the field"""
        for enemy in self.enemies:
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

            enemy.position['x'] = starting_x
            enemy.position['y'] = starting_y

    def move_player(self, player):  # 1's are used again here for player width and height, for same reason as above
        """Update player position on the field"""
        player_x = player.position['x']
        player_y = player.position['y']

        if self.play_area['width'] - 5 + 153 - player.pos_change['dx'] \
                >= player_x >= -5 - player.pos_change['dx']:
            diff_x = player.pos_change['dx']
            x_pos = player_x + diff_x
            player.position['x'] = x_pos

        if self.play_area['height'] - 5 + 148 - player.pos_change['dy'] \
                >= player_y >= -10 - player.pos_change['dy']:
            diff_y = player.pos_change['dy']
            y_pos = player_y + diff_y
            player.position['y'] = y_pos

    def move_enemy(self, enemy):
        """Update enemy position on the field"""
        print "Initial enemy x position " + str(enemy.position['x'])
        print "Initial enemy y position " + str(enemy.position['y'])
        enemy.position['x'] += enemy.pos_change['dx']
        enemy.position['y'] += enemy.pos_change['dy']
        print "New enemy x position " + str(enemy.position['x'])
        print "New enemy y position " + str(enemy.position['y'])
        enemy.distance += enemy.speed
        if enemy.distance > enemy.distance_interval:
            enemy.distance -= enemy.distance_interval
            enemy.img_num = (enemy.img_num + 1) % 2
            enemy.update_image()

    def move_bullet(self, bullet):
        """Update bullet position and enemy health based on collisions"""
        start_x = bullet.position['x']
        start_y = bullet.position['y']
        diff_x = bullet.pos_change['dx']
        diff_y = bullet.pos_change['dy']
        end_x = start_x + diff_x
        end_y = start_y + diff_y

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

        bullet.position['x'] = end_x
        bullet.position['y'] = end_y

    def check_collision(self, object1, object2):
        """Compute if two given objects are colliding"""
        if object1.left_bound() < object2.right_bound() \
                and object1.right_bound() > object2.left_bound() \
                and object1.top_bound() < object2.bottom_bound() \
                and object1.bottom_bound() > object2.top_bound():
            self.collide_process(object1, object2)
            return True
        else:
            return False

    def collide_process(self, object1, object2):
        """Handle what should happen on collision between different objects"""
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

    def update(self):
        """Update the state of the game"""
        self.move_player(self.player1)
        self.move_player(self.player2)

        for bullet in self.bullets:
            self.move_bullet(bullet)

        for enemy in self.enemies:
            enemy.closest_player(self.player1, self.player2)
            self.move_enemy(enemy)
            if enemy.hit:
                enemy.hit = False


class IndexHandler(tornado.web.RequestHandler):
    @tornado.web.asynchronous
    def get(request):
        request.render('index.html')

clients = []
clients_started = []
game = Game()

class WebSocketGameHandler(tornado.websocket.WebSocketHandler):
    def __init__(self, application, request, **kwargs):
        super(WebSocketGameHandler, self).__init__(application, request, **kwargs)
        #self.clients = []
        #self.game = Game()
        self.client_id = 0
        #self.clients_started = 0
        self.update_loop = tornado.ioloop.PeriodicCallback(self.update_clients, 40)
        self.initial_state_1p = dict(
            message='singlePlayerGame',
            gameState=dict(
                player=dict(x=game.player1.position['x'], y=game.player1.position['y'])
            )
        )
        self.initial_state_2p = dict(
            message='twoPlayerGame',
            gameState=dict(
                player=dict(x=game.player1.position['x'], y=game.player1.position['y']),
                otherPlayer=dict(x=game.player2.position['x'], y=game.player2.position['y'])
            )
        )
        self.update_state = dict(
            message='updateState',
            gameState=dict(
                enemyData=[],
                bulletData=[],
                playerData=dict(x=0, y=0, imgNum=0),
                otherPlayerData=dict(x=0, y=0, imgNum=0)
            )
        )

    def open(self, *args):
        print('open', 'WebSocketGameHandler')
        print len(clients)
        print clients
        clients.append(self)
        print clients
        self.client_id = len(clients)
        set_client_id = dict(
            clientID=self.client_id
        )
        scid = json.dumps(set_client_id)
        clients[self.client_id-1].write_message(scid)

    def on_message(self, message):
        print message

        in_msg = json.loads(message)

        print in_msg

        if in_msg['message'] == 'singlePlayerGame':
            print "In spg"
            out_msg = json.dumps(self.initial_state_1p)
            self.write_message(out_msg)
            print "Game should start!"
            game.populate_enemies()
            game.spawn_enemies()
            self.update_loop.start()
        elif in_msg['message'] == 'twoPlayerGame':
            if self not in clients_started:
                clients_started.append(self)
            if len(clients_started) == 2:
                game.__init__()
                print "Game should start!"
                out_msg = json.dumps(self.initial_state_2p)
                for client in clients_started:
                    client.write_message(out_msg)
                game.populate_enemies()
                game.spawn_enemies()
                for client in clients_started:
                    client.update_loop.start()
                clients_started.__init__()
        elif in_msg['message'] == 'mousedown':
            if in_msg['clientID'] == 1:
                game.player1.aim['x'] = in_msg['x']
                game.player1.aim['y'] = in_msg['y']
                game.player1.shoot(game)
            elif in_msg['clientID'] == 2:
                game.player2.aim['x'] = in_msg['x']
                game.player2.aim['y'] = in_msg['y']
                game.player2.shoot(game)
        elif in_msg['message'] == 'mouseup':
            pass
        elif in_msg['message'] == 'mousemove':
            if in_msg['clientID'] == 1:
                game.player1.aim_weapon(in_msg['direction'])
            elif in_msg['clientID'] == 2:
                game.player2.aim_weapon(in_msg['direction'])
        elif in_msg['message'] == 'keydown':
            if in_msg['clientID'] == 1:
                if in_msg['keycode'] == KEY_W:
                    game.player1.up = True
                    game.player1.update_movement()
                elif in_msg['keycode'] == KEY_A:
                    game.player1.left = True
                    game.player1.update_movement()
                elif in_msg['keycode'] == KEY_S:
                    game.player1.down = True
                    game.player1.update_movement()
                elif in_msg['keycode'] == KEY_D:
                    game.player1.right = True
                    game.player1.update_movement()
                elif in_msg['keycode'] == KEY_E:
                    if game.player1.pistol_equipped:
                        game.player1.pistol_equipped = False
                    else:
                        game.player1.pistol_equipped = True
                elif in_msg['keycode'] == KEY_SPACE:
                    game.player1.sprint = True
                    game.player1.update_movement()
            elif in_msg['clientID'] == 2:
                if in_msg['keycode'] == KEY_W:
                    game.player2.up = True
                    game.player2.update_movement()
                elif in_msg['keycode'] == KEY_A:
                    game.player2.left = True
                    game.player2.update_movement()
                elif in_msg['keycode'] == KEY_S:
                    game.player2.down = True
                    game.player2.update_movement()
                elif in_msg['keycode'] == KEY_D:
                    game.player2.right = True
                    game.player2.update_movement()
                elif in_msg['keycode'] == KEY_E:
                    if game.player2.pistol_equipped:
                        game.player2.pistol_equipped = False
                    else:
                        game.player2.pistol_equipped = True
                elif in_msg['keycode'] == KEY_SPACE:
                    game.player2.sprint = True
                    game.player2.update_movement()
        elif in_msg['message'] == 'keyup':
            if in_msg['clientID'] == 1:
                if in_msg['keycode'] == KEY_W:
                    game.player1.up = False
                    game.player1.update_movement()
                elif in_msg['keycode'] == KEY_A:
                    game.player1.left = False
                    game.player1.update_movement()
                elif in_msg['keycode'] == KEY_S:
                    game.player1.down = False
                    game.player1.update_movement()
                elif in_msg['keycode'] == KEY_D:
                    game.player1.right = False
                    game.player1.update_movement()
                elif in_msg['keycode'] == KEY_SPACE:
                    game.player1.sprint = False
                    game.player1.update_movement()
            elif in_msg['clientID'] == 2:
                if in_msg['keycode'] == KEY_W:
                    game.player2.up = False
                    game.player2.update_movement()
                elif in_msg['keycode'] == KEY_A:
                    game.player2.left = False
                    game.player2.update_movement()
                elif in_msg['keycode'] == KEY_S:
                    game.player2.down = False
                    game.player2.update_movement()
                elif in_msg['keycode'] == KEY_D:
                    game.player2.right = False
                    game.player2.update_movement()
                elif in_msg['keycode'] == KEY_SPACE:
                    game.player2.sprint = False
                    game.player2.update_movement()

    def on_close(self):
        print('close', 'WebSocketGameHandler')
        clients.remove(self)
        self.update_loop.stop()

    def update_clients(self):
        enemy_obj = dict(
            x=0,
            y=0,
            type='gridBug',
            imgNum=0
        )

        bullet_obj = dict(
            x=0,
            y=0
        )

        self.update_state['gameState']['enemyData'] = []
        for enemy in game.enemies:
            enemy_obj = {}
            enemy_obj['x'] = enemy.position['x']
            enemy_obj['y'] = enemy.position['y']
            enemy_obj['imgNum'] = enemy.img_num
            if type(enemy) is GridBug:
                enemy_obj['type'] = 'gridBug'
            elif type(enemy) is Roller:
                enemy_obj['type'] = 'roller'
            elif type(enemy) is Heavy:
                enemy_obj['type'] = 'heavy'
            self.update_state['gameState']['enemyData'].append(enemy_obj)

        self.update_state['gameState']['bulletData'] = []
        for bullet in game.bullets:
            bullet_obj = {}
            bullet_obj['x'] = bullet.position['x']
            bullet_obj['y'] = bullet.position['y']

            self.update_state['gameState']['bulletData'].append(bullet_obj)



        print len(self.update_state['gameState']['bulletData'])

        self.update_state['gameState']['playerData']['x'] = game.player1.position['x']
        self.update_state['gameState']['playerData']['y'] = game.player1.position['y']
        self.update_state['gameState']['playerData']['imgNum'] = game.player1.image_num

        self.update_state['gameState']['otherPlayerData']['x'] = game.player2.position['x']
        self.update_state['gameState']['otherPlayerData']['y'] = game.player2.position['y']
        self.update_state['gameState']['otherPlayerData']['imgNum'] = game.player2.image_num

        ud_st = json.dumps(self.update_state)
        self.write_message(ud_st)

        game.update()

settings = {
    'static_path': os.path.join(os.path.dirname(__file__), 'static')
}

handlers = [
    (r'/game', WebSocketGameHandler),
    (r'/', IndexHandler),
    (r'/static/JS/(.*)', tornado.web.StaticFileHandler, {'path': settings['static_path']}),
    (r'/static/CSS/(.*)', tornado.web.StaticFileHandler, {'path': settings['static_path']}),
    (r'/static/SPRITES/(.*)', tornado.web.StaticFileHandler, {'path': settings['static_path']}),
    (r'/static/SPRITES/player/(.*)', tornado.web.StaticFileHandler, {'path': settings['static_path']}),
    (r'/static/SPRITES/roller/(.*)', tornado.web.StaticFileHandler, {'path': settings['static_path']}),
    (r'/static/SPRITES/GRIDBUG/(.*)', tornado.web.StaticFileHandler, {'path': settings['static_path']}),
    (r'/static/IMG/(.*)', tornado.web.StaticFileHandler, {'path': settings['static_path']})
]

app = tornado.web.Application(handlers, **settings)

if __name__ == '__main__':
    parse_command_line()
    app.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()