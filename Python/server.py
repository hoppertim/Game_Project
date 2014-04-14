__author__ = 'John Goen'

import tornado.ioloop
import tornado.web
import tornado.websocket
import json
import os

import enemy_s
import game_s

KEY_W = 87
KEY_A = 65
KEY_S = 83
KEY_D = 68
KEY_E = 69
KEY_SPACE = 32

from tornado.options import define, options, parse_command_line

define("port", default=11000, help="run on the given port", type=int)


class IndexHandler(tornado.web.RequestHandler):
    @tornado.web.asynchronous
    def get(request):
        request.render('index.html')

clients = []
clients_started = []
game = game_s.Game()


class WebSocketGameHandler(tornado.websocket.WebSocketHandler):
    def __init__(self, application, request, **kwargs):
        super(WebSocketGameHandler, self).__init__(application, request, **kwargs)
        self.client_id = 0
        self.wave_wait = 0
        self.update_loop = tornado.ioloop.PeriodicCallback(self.update_clients, 40)
        self.initial_state_1p = dict(
            message='singlePlayerGame',
            gameState=dict(
                player=dict(x=game.player1.position['x'], y=game.player1.position['y'], health=100)
            )
        )
        self.initial_state_2p = dict(
            message='twoPlayerGame',
            gameState=dict(
                player=dict(x=game.player1.position['x'], y=game.player1.position['y'], health=100),
                otherPlayer=dict(x=game.player2.position['x'], y=game.player2.position['y'], health=100)
            )
        )
        self.update_state = dict(
            message='updateState',
            gameState=dict(
                enemyData=[],
                bulletData=[],
                playerData=dict(x=0, y=0, imgNum=0, health=100),
                otherPlayerData=dict(x=0, y=0, imgNum=0, health=100)
            )
        )

        self.game_lost = dict(
            message='gameLost'
        )

        self.wave_complete = dict(
            message='waveComplete'
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
        in_msg = json.loads(message)

        if in_msg['message'] == 'singlePlayerGame':
            print "In spg"
            out_msg = json.dumps(self.initial_state_1p)
            self.write_message(out_msg)
            print "Game should start!"
            game.__init__()
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
                self.update_loop.start()
                clients_started.__init__()
        elif in_msg['message'] == 'nextWave':
            print "Start next wave!"
            if self not in clients_started:
                clients_started.append(self)
            if len(clients_started) == 2:
                self.update_loop.start()
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

        for client in clients:
            client.update_state['gameState']['enemyData'] = []

        for enemy in game.enemies:
            enemy_obj = {}
            enemy_obj['x'] = enemy.position['x']
            enemy_obj['y'] = enemy.position['y']
            enemy_obj['imgNum'] = enemy.img_num
            if type(enemy) is enemy_s.GridBug:
                enemy_obj['type'] = 'gridBug'
            elif type(enemy) is enemy_s.Roller:
                enemy_obj['type'] = 'roller'
            elif type(enemy) is enemy_s.Heavy:
                enemy_obj['type'] = 'heavy'

            for client in clients:
                client.update_state['gameState']['enemyData'].append(enemy_obj)

        for client in clients:
            client.update_state['gameState']['bulletData'] = []

        for bullet in game.bullets:
            bullet_obj = {}
            bullet_obj['x'] = bullet.position['x']
            bullet_obj['y'] = bullet.position['y']

            for client in clients:
                client.update_state['gameState']['bulletData'].append(bullet_obj)

        print "CLIENT ID: " + str(self.client_id)

        clients[0].update_state['gameState']['playerData']['x'] = game.player2.position['x']
        clients[0].update_state['gameState']['playerData']['y'] = game.player2.position['y']
        clients[0].update_state['gameState']['playerData']['imgNum'] = game.player2.image_num
        clients[0].update_state['gameState']['playerData']['health'] = game.player2.health

        clients[0].update_state['gameState']['otherPlayerData']['x'] = game.player1.position['x']
        clients[0].update_state['gameState']['otherPlayerData']['y'] = game.player1.position['y']
        clients[0].update_state['gameState']['otherPlayerData']['imgNum'] = game.player1.image_num
        clients[0].update_state['gameState']['otherPlayerData']['health'] = game.player1.health

        clients[1].update_state['gameState']['playerData']['x'] = game.player1.position['x']
        clients[1].update_state['gameState']['playerData']['y'] = game.player1.position['y']
        clients[1].update_state['gameState']['playerData']['imgNum'] = game.player1.image_num
        clients[1].update_state['gameState']['playerData']['health'] = game.player1.health

        clients[1].update_state['gameState']['otherPlayerData']['x'] = game.player2.position['x']
        clients[1].update_state['gameState']['otherPlayerData']['y'] = game.player2.position['y']
        clients[1].update_state['gameState']['otherPlayerData']['imgNum'] = game.player2.image_num
        clients[1].update_state['gameState']['otherPlayerData']['health'] = game.player2.health

        if game.game_lost:
            lost = json.dumps(self.game_lost)
            for client in clients:
                client.write_message(lost)

            self.update_loop.stop()
            print "YOU LOST"

            game.__init__()
        elif game.wave_complete:
            wc = json.dumps(self.wave_complete)
            self.wave_wait += 1
            if self.wave_wait >= 50:
                self.wave_wait = 0

                for client in clients:
                    client.write_message(wc)

                self.update_loop.stop()
                print "YOU COMPLETED WAVE " + str(game.level_number)

                next_level = game.level_number + 1
                game.__init__()
                game.level_number = next_level
                game.populate_enemies()
                game.spawn_enemies()
                #self.update_loop.start()
            else:
                for client in clients:
                    ud_st = json.dumps(client.update_state)
                    client.write_message(ud_st)
        else:
            for client in clients:
                ud_st = json.dumps(client.update_state)
                client.write_message(ud_st)

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
    (r'/static/IMG/(.*)', tornado.web.StaticFileHandler, {'path': settings['static_path']}),
    (r'/static/AUDIO/(.*)', tornado.web.StaticFileHandler, {'path': settings['static_path']})
]

app = tornado.web.Application(handlers, **settings)

if __name__ == '__main__':
    parse_command_line()
    app.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()