__author__ = 'jtgoen'

import random

import player_s
import enemy_s
import bullet_s


class Game(object):
    """Structure that holds the state of a given game"""
    def __init__(self):
        self.play_area = dict(width=1200, height=800)
        self.player1 = player_s.Player(400, 300)
        self.player2 = player_s.Player(600, 300)
        self.bullets = []
        self.enemies = []
        self.level_complete = False
        self.level_number = 1
        self.game_lost = False
        self.wave_complete = False

    def populate_enemies(self):
        """Populate enemies list randomly"""
        hp_multiplier = self.level_number
        for i in range(0, 6*self.level_number):
            num = random.random() * 2

            if num <= 1:
                self.enemies.append(enemy_s.GridBug(-1, 0, hp_multiplier))
            elif num <= 1.5:
                self.enemies.append(enemy_s.Roller(-1, 0, hp_multiplier))
            else:
                self.enemies.append(enemy_s.GridBug(-1, 0, hp_multiplier))  # TODO include Heavy instead

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

        if self.play_area['width'] + 15 - 64 - player.pos_change['dx'] \
                >= player_x >= -5 - player.pos_change['dx']:
            diff_x = player.pos_change['dx']
            x_pos = player_x + diff_x
            player.position['x'] = x_pos

        if self.play_area['height'] + 5 - 64 - player.pos_change['dy'] \
                >= player_y >= -10 - player.pos_change['dy']:
            diff_y = player.pos_change['dy']
            y_pos = player_y + diff_y
            player.position['y'] = y_pos

    def move_enemy(self, enemy):
        """Update enemy position on the field"""
        enemy.position['x'] += enemy.pos_change['dx']
        enemy.position['y'] += enemy.pos_change['dy']
        enemy.distance += enemy.speed

        if enemy.distance > enemy.distance_interval:
            enemy.distance -= enemy.distance_interval

        if enemy.image_wait >= enemy.image_interval or enemy.hit or enemy.was_hit:
                enemy.image_wait = 0
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
        if isinstance(object1, player_s.Player) and isinstance(object2, enemy_s.Enemy):
            if object2.attack_wait >= object2.damage_interval:
                object2.attack_wait = 0
                object1.health -= object2.strength
                object1.hit = True
        elif isinstance(object1, enemy_s.Enemy) and isinstance(object2, player_s.Player):
            if object1.attack_wait >= object1.damage_interval:
                object1.attack_wait = 0
                object2.health -= object1.strength
                object2.hit = True
        elif isinstance(object1, bullet_s.Bullet) and isinstance(object2, enemy_s.Enemy):
            if isinstance(object2, enemy_s.GridBug) \
                    or isinstance(object2, enemy_s.Roller) \
                    or isinstance(object2, enemy_s.Heavy):
                object2.health -= object1.strength
            object2.hit = True
        elif isinstance(object1, enemy_s.Enemy) and isinstance(object2, bullet_s.Bullet):
            if isinstance(object1, enemy_s.GridBug) \
                    or isinstance(object1, enemy_s.Roller) \
                    or isinstance(object1, enemy_s.Heavy):
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
            enemy.attack_wait += 1
            enemy.image_wait += 1
            self.move_enemy(enemy)
            if enemy.hit:
                enemy.hit = False
                enemy.was_hit = True
            elif enemy.was_hit:
                enemy.was_hit = False

            if self.check_collision(enemy, self.player1):
                print "Player 1 Hit! Health now at " + str(self.player1.health)

            if self.check_collision(enemy, self.player2):
                print "Player 2 Hit! Health now at " + str(self.player2.health)

        if self.player1.hit:
            self.player1.hit = False
        if self.player2.hit:
            self.player2.hit = False

        if self.player1.health <= 0 or self.player2.health <= 0:
            self.game_lost = True
        elif len(self.enemies) <= 0:
            self.wave_complete = True