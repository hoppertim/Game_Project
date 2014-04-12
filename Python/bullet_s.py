__author__ = 'jtgoen'


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