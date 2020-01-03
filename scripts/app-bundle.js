define('app',['exports', 'aurelia-framework', 'jquery', 'aurelia-event-aggregator', './services/keystroke-service', './services/touch-service', './services/timing-service'], function (exports, _aureliaFramework, _jquery, _aureliaEventAggregator, _keystrokeService, _touchService, _timingService) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.App = undefined;

    var _jquery2 = _interopRequireDefault(_jquery);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var App = exports.App = (_dec = (0, _aureliaFramework.inject)(_keystrokeService.KeystrokeService, _touchService.TouchService, _timingService.TimingService, _aureliaEventAggregator.EventAggregator), _dec(_class = function App(keystrokeService, touchService, timingService, eventAggregator) {
        _classCallCheck(this, App);

        this.keystrokeService = keystrokeService;
        this.touchService = touchService;
        this.timingService = timingService;
        this.ea = eventAggregator;
        this.message = 'Snake by ashWare';
    }) || _class);
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment'], function (exports, _environment) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.configure = configure;

    var _environment2 = _interopRequireDefault(_environment);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    Promise.config({
        longStackTraces: _environment2.default.debug,
        warnings: {
            wForgottenReturn: false
        }
    });

    function configure(aurelia) {
        aurelia.use.standardConfiguration().feature('resources');

        aurelia.use.plugin('aurelia-cookie');

        if (_environment2.default.debug) {
            aurelia.use.developmentLogging();
        }

        if (_environment2.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }

        aurelia.start().then(function () {
            return aurelia.setRoot();
        });
    }
});
define('components/game-screen',['exports', 'aurelia-framework', 'aurelia-event-aggregator', '../services/touch-service', '../services/screen-service', '../services/snake-service', '../services/snack-service'], function (exports, _aureliaFramework, _aureliaEventAggregator, _touchService, _screenService, _snakeService, _snackService) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.GameScreenCustomElement = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var GameScreenCustomElement = exports.GameScreenCustomElement = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator, _touchService.TouchService, _screenService.ScreenService, _snakeService.SnakeService, _snackService.SnackService), _dec(_class = function () {
        function GameScreenCustomElement(eventAggregator, touchService, screenService, snakeService, snackService) {
            var _this = this;

            _classCallCheck(this, GameScreenCustomElement);

            this.ea = eventAggregator;
            this.touchService = touchService;
            this.screenService = screenService;
            this.snakeService = snakeService;
            this.snackService = snackService;
            this.snakeImages = [];
            this.snackImages = [];
            this.spriteSize = 16;

            this.snakeParts = this.snakeService.snakeParts;
            this.snackNames = this.snackService.names;
            this.snacks = this.snackService.snacks;
            this.animationTime = function () {
                return _this.screenService.getAnimationTime();
            };
        }

        GameScreenCustomElement.prototype.roundToSpriteSize = function roundToSpriteSize(size) {
            return Math.floor(size / this.spriteSize) * this.spriteSize;
        };

        GameScreenCustomElement.prototype.snakeImage = function snakeImage(index) {
            switch (index) {
                case 0:
                    return 'head';
                case this.snakeService.snake.segments.length:
                    return 'tail';
                default:
                    return 'body';
            }
        };

        GameScreenCustomElement.prototype.segmentCSS = function segmentCSS(index, x, y) {
            var rotationStr = '';
            if (index == 0) {
                var rotation = this.snakeService.snake.direction * 90;
                rotationStr = 'transform: rotate(' + rotation + 'deg);';
            }
            var css = 'left: ' + x + 'px; top: ' + y + 'px; ' + rotationStr + ' transition: all ' + this.animationTime + 's linear; -webkit-transition: all ' + this.animationTime() + 's linear;';
            return css;
        };

        GameScreenCustomElement.prototype.snackPosition = function snackPosition(index) {
            var snack = this.snackService.snacks[index];
            return {
                left: snack.position.x + 'px',
                top: snack.position.y + 'px'
            };
        };

        GameScreenCustomElement.prototype.attached = function attached() {
            var self = this;
            this.$arena = $('.arena');
            var $body = $('body');
            var targetWidth = this.roundToSpriteSize($body.width() - 48);
            var targetHeight = this.roundToSpriteSize($body.height() - 48);
            this.$arena.width(targetWidth);
            this.$arena.height(targetHeight);
            this.touchService.setAreaSize(this.$arena);
            this.screenService.setDomVars(this.$arena);
        };

        return GameScreenCustomElement;
    }()) || _class);
});
define('components/restart-overlay',['exports', 'aurelia-framework', 'aurelia-event-aggregator', '../services/touch-service'], function (exports, _aureliaFramework, _aureliaEventAggregator, _touchService) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.RestartOverlayCustomElement = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var RestartOverlayCustomElement = exports.RestartOverlayCustomElement = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator, _touchService.TouchService), _dec(_class = function () {
        function RestartOverlayCustomElement(eventAggregator, touchService) {
            _classCallCheck(this, RestartOverlayCustomElement);

            this.ea = eventAggregator;
            this.touchService = touchService;
            this.showOverlay = true;
            this.firstGame = true;
            this.started = false;
            this.pause = false;
        }

        RestartOverlayCustomElement.prototype.start = function start() {
            if (!this.started) {
                this.ea.publish('start');
                this.firstGame = false;
                this.started = true;
            }
            return false;
        };

        RestartOverlayCustomElement.prototype.addEventListeners = function addEventListeners() {
            var _this = this;

            this.ea.subscribe('gameOver', function (response) {
                _this.showOverlay = true;
                _this.started = false;
            });
            this.ea.subscribe('start', function (response) {
                _this.showOverlay = false;
            });
            this.ea.subscribe('pause', function (response) {
                _this.pause = !_this.pause;
            });
        };

        RestartOverlayCustomElement.prototype.attached = function attached() {
            this.addEventListeners();
        };

        return RestartOverlayCustomElement;
    }()) || _class);
});
define('components/status',['exports', 'aurelia-framework', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _aureliaEventAggregator) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.StatusCustomElement = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var StatusCustomElement = exports.StatusCustomElement = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = function () {
        function StatusCustomElement(eventAggregator) {
            _classCallCheck(this, StatusCustomElement);

            this.ea = eventAggregator;
            this.score = 0;
            this.highScore;
            this.resetVars();
            this.snacksForIndicator = 'beer bunny ruby snail viagra weed';
            this.indicators = [];
        }

        StatusCustomElement.prototype.addEventListeners = function addEventListeners() {
            var _this = this;

            this.ea.subscribe('speed', function (response) {
                _this.speed = response;
            });
            this.ea.subscribe('grow', function (response) {
                _this.length = response;
            });
            this.ea.subscribe('start', function (response) {
                _this.resetVars();
            });
            this.ea.subscribe('score', function (response) {
                _this.score = response.score;
                _this.highScore = response.highScore;
            });
            this.ea.subscribe('snack', function (response) {
                _this.snack = response;
                var name = response.split(':')[0].toLowerCase();
                if (_this.snacksForIndicator.indexOf(name) >= 0) {
                    _this.indicators.push(name);
                    setTimeout(function () {
                        _this.indicators.shift();
                        _this.snack = '';
                    }, 15000);
                }
            });
            this.ea.subscribe('die', function (response) {
                _this.snack = response;
            });
        };

        StatusCustomElement.prototype.resetHighscore = function resetHighscore() {
            this.ea.publish('resetHigh');
        };

        StatusCustomElement.prototype.resetVars = function resetVars() {
            this.speed = 0;
            this.length = 1;
            this.score = 0;
            this.snack = '';
        };

        StatusCustomElement.prototype.attached = function attached() {
            this.addEventListeners();
        };

        return StatusCustomElement;
    }()) || _class);
});
define('services/keystroke-service',['exports', 'aurelia-framework', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _aureliaEventAggregator) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.KeystrokeService = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var KeystrokeService = exports.KeystrokeService = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = function () {
        function KeystrokeService(eventAggregator) {
            _classCallCheck(this, KeystrokeService);

            this.ea = eventAggregator;
            this.acceptMoves = true;
            this.myKeypressCallback = this.keypressInput.bind(this);
            this.setSubscribers();
        }

        KeystrokeService.prototype.keysOff = function keysOff() {
            this.acceptMoves = false;
        };

        KeystrokeService.prototype.keysOn = function keysOn() {
            this.acceptMoves = true;
        };

        KeystrokeService.prototype.setSubscribers = function setSubscribers() {
            var _this = this;

            document.addEventListener('keydown', this.myKeypressCallback, false);
            this.ea.subscribe('keysOff', function (response) {
                _this.keysOff();
            });
            this.ea.subscribe('keysOn', function (response) {
                _this.keysOn();
            });
        };

        KeystrokeService.prototype.keypressInput = function keypressInput(e) {
            var keycode = event.key;
            this.acceptMoves && this.ea.publish('keyPressed', keycode);
        };

        return KeystrokeService;
    }()) || _class);
});
define('services/score-service',['exports', 'aurelia-framework', 'aurelia-event-aggregator', 'aurelia-cookie'], function (exports, _aureliaFramework, _aureliaEventAggregator, _aureliaCookie) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.ScoreService = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var ScoreService = exports.ScoreService = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = function () {
        function ScoreService(eventAggregator) {
            var _this = this;

            _classCallCheck(this, ScoreService);

            this.ea = eventAggregator;

            this.multiplier = 1;
            this.score = 0;
            this.highScore = this.readHighscore();
            this.ea.subscribe('gameOver', function (response) {
                _this.saveHighscore();
            });
            this.ea.subscribe('resetHigh', function (response) {
                _this.resetHighscore();
            });
        }

        ScoreService.prototype.update = function update(amount) {
            amount && (this.score += amount * this.multiplier);
            this.highScore = Math.max(this.score, this.highScore);
            this.ea.publish('score', {
                score: this.score,
                highScore: this.highScore
            });
        };

        ScoreService.prototype.setMultiplier = function setMultiplier(factor) {
            if (factor) {
                this.multiplier = factor;
            } else {
                this.multiplier = 10;
            }
        };

        ScoreService.prototype.resetMultiplier = function resetMultiplier() {
            this.multiplier = 1;
        };

        ScoreService.prototype.saveHighscore = function saveHighscore() {
            _aureliaCookie.AureliaCookie.set('highScore', this.highScore, {
                expiry: -1
            });
        };

        ScoreService.prototype.readHighscore = function readHighscore() {
            var hs = _aureliaCookie.AureliaCookie.get('highScore');
            if (hs > 0) {
                return hs;
            }
            return 0;
        };

        ScoreService.prototype.resetHighscore = function resetHighscore() {
            this.highScore = 0;
            this.saveHighscore();
        };

        ScoreService.prototype.initScore = function initScore() {
            this.score = 0;
        };

        return ScoreService;
    }()) || _class);
});
define('services/screen-service',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.ScreenService = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var ScreenService = exports.ScreenService = function () {
        function ScreenService(eventAggregator) {
            _classCallCheck(this, ScreenService);

            this.spriteSize = 16;
            this.halfSprite = this.spriteSize / 2;
            this.snackSize = 24;
            this.halfSnackSize = this.snackSize / 2;
            this.canvasCenter = {};
            this.limits = {};
            this.animationTime;
        }

        ScreenService.prototype.setAnimationTime = function setAnimationTime(time) {
            this.animationTime = time;
        };

        ScreenService.prototype.getAnimationTime = function getAnimationTime() {
            return this.animationTime;
        };

        ScreenService.prototype.setCanvasCenter = function setCanvasCenter(x, y) {
            this.canvasCenter = {
                x: x,
                y: y
            };
        };

        ScreenService.prototype.getCanvasCenter = function getCanvasCenter() {
            return this.canvasCenter;
        };

        ScreenService.prototype.setLimits = function setLimits(w, h) {
            this.limits = {
                right: w,
                bottom: h,
                left: 0,
                top: 0
            };
        };

        ScreenService.prototype.getLimits = function getLimits() {
            return this.limits;
        };

        ScreenService.prototype.roundToSpriteSize = function roundToSpriteSize(size) {
            return Math.floor(size / this.spriteSize) * this.spriteSize;
        };

        ScreenService.prototype.setDomVars = function setDomVars($arena) {
            this.canvas = $('#arena')[0];
            this.canvas.width = this.canvas.clientWidth;
            this.canvas.height = this.canvas.clientHeight;
            this.setCanvasCenter(this.roundToSpriteSize($arena.width() / 2), this.roundToSpriteSize($arena.height() / 2));
            this.setLimits(this.canvas.width, this.canvas.height);
        };

        return ScreenService;
    }();
});
define('services/snack-service',['exports', 'aurelia-framework', 'aurelia-event-aggregator', './screen-service'], function (exports, _aureliaFramework, _aureliaEventAggregator, _screenService) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.SnackService = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var SnackService = exports.SnackService = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator, _screenService.ScreenService), _dec(_class = function () {
        function SnackService(eventAggregator, screenService) {
            _classCallCheck(this, SnackService);

            this.ea = eventAggregator;
            this.screenService = screenService;
            this.snacks = [];
            this.mixUp = false;
            this.names = ['axe', 'beer', 'bunny', 'diamond', 'gold', 'ruby', 'skull', 'snail', 'trash', 'viagra', 'weed'];
        }

        SnackService.prototype.newSnack = function newSnack(x, y, name, i) {
            var snack = {
                position: {
                    x: x,
                    y: y
                },
                name: name,
                nameIndex: i
            };
            return snack;
        };

        SnackService.prototype.samePosition = function samePosition(pos1, pos2) {
            return pos1.x == pos2.x && pos1.y == pos2.y;
        };

        SnackService.prototype.hitSnack = function hitSnack(head, neck) {
            for (var i = 0; i < this.snacks.length - 1; i++) {
                var snack = this.snacks[i];
                if (this.samePosition(snack.position, head) || this.samePosition(snack.position, neck)) {
                    this.removeSnack(i);
                    if (this.mixUp) {
                        var randomSnack = Math.floor(Math.random() * this.names.length);
                        return this.names[randomSnack];
                    } else {
                        return snack.name;
                    }
                }
            }
            return 'nope';
        };

        SnackService.prototype.addSnack = function addSnack() {
            var randomIndex = Math.floor(Math.random() * this.names.length);
            var snack = this.names[randomIndex];
            var x = this.screenService.roundToSpriteSize(Math.floor(Math.random() * (this.screenService.limits.right - this.screenService.spriteSize)));
            var y = this.screenService.roundToSpriteSize(Math.floor(Math.random() * (this.screenService.limits.bottom - this.screenService.spriteSize)));
            this.snacks.push(this.newSnack(x, y, snack, randomIndex));
        };

        SnackService.prototype.mixSnacks = function mixSnacks() {
            this.mixUp = true;
        };

        SnackService.prototype.unMixSnacks = function unMixSnacks() {
            this.mixUp = false;
        };

        SnackService.prototype.removeSnack = function removeSnack(index) {
            this.snacks.splice(index, 1);
        };

        SnackService.prototype.initSnacks = function initSnacks() {
            this.snacks = [];
        };

        return SnackService;
    }()) || _class);
});
define('services/snake-service',['exports', 'aurelia-framework', 'aurelia-event-aggregator', './screen-service', '../services/snack-service'], function (exports, _aureliaFramework, _aureliaEventAggregator, _screenService, _snackService) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.SnakeService = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var SnakeService = exports.SnakeService = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator, _screenService.ScreenService, _snackService.SnackService), _dec(_class = function () {
        function SnakeService(eventAggregator, screenService, snackService) {
            var _this = this;

            _classCallCheck(this, SnakeService);

            this.ea = eventAggregator;
            this.screenService = screenService;
            this.snackService = snackService;
            this.snakeParts = ['head', 'body', 'tail'];
            this.snake = {
                direction: 0,
                directions: [[[1, 0], [0, 1, 0, -1]], [[0, 1], [-1, 0, 1, 0]], [[-1, 0], [0, -1, 0, 1]], [[0, -1], [1, 0, -1, 0]], [[0, 0], [0, 0, 0, 0]]],
                segments: [],
                deadSegments: []
            };
            this.snackMethods = {
                nope: function nope() {
                    void 0;
                },
                axe: function axe() {
                    _this.cutSnake();
                    _this.ea.publish('snack', 'Axe: lost half of yourself');
                },
                beer: function beer() {
                    _this.ea.publish('snack', 'Beer: grow slower for 15 seconds');
                },
                bunny: function bunny() {
                    _this.ea.publish('snack', 'Bunny: run faster for 15 seconds');
                },
                diamond: function diamond() {
                    _this.ea.publish('snack', 'Diamond: 10000 points');
                },
                gold: function gold() {
                    _this.ea.publish('snack', 'Gold: 1000 points');
                },
                ruby: function ruby() {
                    _this.ea.publish('snack', 'Ruby: score &times; 10 for 15 seconds');
                },
                skull: function skull() {
                    _this.ea.publish('snack', 'Skull: you die');
                },
                snail: function snail() {
                    _this.ea.publish('snack', 'Snail: run slower for 15 seconds');
                },
                trash: function trash() {
                    _this.ea.publish('snack', 'Trash: trash all extra&rsquo;s');
                },
                viagra: function viagra() {
                    _this.ea.publish('snack', 'Viagra: grow harder for 15 seconds');
                },
                weed: function weed() {
                    _this.ea.publish('snack', 'Weed: high for 15 seconds');
                }
            };
            this.setSubscribers();
        }

        SnakeService.prototype.mod = function mod(m, n) {
            return (m % n + n) % n;
        };

        SnakeService.prototype.step = function step(grow) {
            this.snake.turnSteps > 0 && this.snake.turnSteps--;
            var tail = this.snake.segments[this.snake.segments.length - 1];
            var newTail = {};
            newTail.x = tail.x;
            newTail.y = tail.y;
            for (var i = this.snake.segments.length - 1; i > 0; i -= 1) {
                this.snake.segments[i].x = this.snake.segments[i - 1].x;
                this.snake.segments[i].y = this.snake.segments[i - 1].y;
            }
            this.snake.segments[0].x += this.snake.directions[this.mod(this.snake.direction, 4)][0][0] * this.snake.segmentSize;
            this.snake.segments[0].y += this.snake.directions[this.mod(this.snake.direction, 4)][0][1] * this.snake.segmentSize;
            this.hitWall();
            this.hitSnake();
            var head = this.snake.segments[0];
            var neck = head;
            this.snake.segments.length > 1 && (neck = this.snake.segments[1]);
            var method = this.snackService.hitSnack(head, neck).toLowerCase();
            this.snackMethods[method]();
            grow && this.snake.segments.push(newTail);
        };

        SnakeService.prototype.cutSnake = function cutSnake() {
            var halfSnake = Math.floor(this.snake.segments.length / 2);
            this.snake.segments.splice(-halfSnake);
        };

        SnakeService.prototype.fallDown = function fallDown() {
            this.crawling = false;
            for (var i = 0; i < this.snake.segments.length; i++) {
                if (this.snake.deadSegments.indexOf(i) < 0) {
                    var segment = this.snake.segments[i];
                    var newY = (segment.y + 1) * 1.05;
                    if (newY <= this.screenService.limits.bottom) {
                        segment.y = newY;
                    } else {
                        this.snake.deadSegments.push(i);
                    }
                }
            }
            if (this.snake.deadSegments.length >= this.snake.segments.length) {
                this.ea.publish('gameOver');
            }
        };

        SnakeService.prototype.hitWall = function hitWall() {
            var head = this.snake.segments[0];
            var wallHit = head.x > this.limits.right - this.snake.segmentSize || head.x < this.limits.left || head.y > this.limits.bottom - this.snake.segmentSize || head.y < this.limits.top;
            if (wallHit) {
                this.ea.publish('die', 'You hit a wall');
                return true;
            }
            return false;
        };

        SnakeService.prototype.hitSnake = function hitSnake() {
            var head = this.snake.segments[0];
            for (var i = 3; i < this.snake.segments.length - 1; i++) {
                var segment = this.snake.segments[i];
                if (this.samePosition(segment, head)) {
                    this.ea.publish('die', 'You tried to bite yourself that&rsquo;s deadly');
                    return true;
                }
            }
            return false;
        };

        SnakeService.prototype.samePosition = function samePosition(pos1, pos2) {
            return pos1.x == pos2.x && pos1.y == pos2.y;
        };

        SnakeService.prototype.setSubscribers = function setSubscribers() {
            var _this2 = this;

            var direction = 0;
            var newDirection = 0;
            var directions = {
                'ArrowRight': 0,
                'ArrowDown': 1,
                'ArrowLeft': 2,
                'ArrowUp': 3
            };
            this.ea.subscribe('keyPressed', function (response) {
                if (response.startsWith('Arrow') && _this2.snake.turnSteps == 0) {
                    _this2.snake.turnSteps = 1;
                    var directionChange = _this2.snake.directions[_this2.mod(_this2.snake.direction, 4)][1][directions[response]];
                    _this2.snake.direction += directionChange;
                }
            });
        };

        SnakeService.prototype.minTurnSteps = function minTurnSteps() {
            return Math.ceil(this.snake.segmentSize / this.snake.stepSize) + 1;
        };

        SnakeService.prototype.initSnake = function initSnake() {
            this.snake.segmentSize = this.screenService.spriteSize;
            this.halfSprite = Math.round(this.snake.segmentSize / 2);
            this.accelleration = 1.01;
            this.score = 0;
            this.snake.deadSegments = [];
            this.snake.stepSize = 16;
            this.snake.segments = [];
            this.snake.turnSteps = 0;
            this.limits = this.screenService.getLimits();
            var center = this.screenService.getCanvasCenter();
            var segment = {};
            segment.x = center.x;
            segment.y = center.y;
            this.snake.segments.push(segment);
        };

        return SnakeService;
    }()) || _class);
});
define('services/timing-service',['exports', 'aurelia-framework', 'aurelia-event-aggregator', './snake-service', './snack-service', './screen-service', './score-service'], function (exports, _aureliaFramework, _aureliaEventAggregator, _snakeService, _snackService, _screenService, _scoreService) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.TimingService = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var TimingService = exports.TimingService = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator, _snakeService.SnakeService, _snackService.SnackService, _screenService.ScreenService, _scoreService.ScoreService), _dec(_class = function () {
        function TimingService(eventAggregator, snakeService, snackService, screenService, scoreService) {
            var _this = this;

            _classCallCheck(this, TimingService);

            this.ea = eventAggregator;
            this.snakeService = snakeService;
            this.snackService = snackService;
            this.screenService = screenService;
            this.scoreService = scoreService;

            this.crawling = false;
            this.steps = 0;
            this.speed = 1;
            this.fallTimerHandle = null;
            this.stepTimerHandle = null;
            this.pause = false;

            this.baseGrowInterval = 10;
            this.baseScoreInterval = 10;
            this.baseSnackInterval = 10;
            this.baseSpeedupInterval = 100;

            this.maxStepInterval = 240;
            this.minStepInterval = 20;
            this.changeStepInterval = 20;

            this.dropInterval = 10;
            this.snackDuration = 15000;

            this.methods = {
                axe: function axe() {
                    void 0;
                },
                beer: function beer() {
                    _this.growSlower();
                },
                bunny: function bunny() {
                    _this.speedUp();
                },
                diamond: function diamond() {
                    _this.scoreService.update(10000);
                },
                gold: function gold() {
                    _this.scoreService.update(1000);
                },
                ruby: function ruby() {
                    _this.multiPlyScore();
                },
                skull: function skull() {
                    _this.dropSnake();
                },
                snail: function snail() {
                    _this.slowDown();
                },
                trash: function trash() {
                    _this.snackService.initSnacks();
                },
                viagra: function viagra() {
                    _this.growHarder();
                },
                weed: function weed() {
                    _this.mixSnacks();
                }
            };

            this.setSubscribers();
        }

        TimingService.prototype.startGame = function startGame() {
            this.resetIntervals();
            this.scoreService.initScore();
            this.snakeService.initSnake();
            this.snackService.initSnacks();
            this.crawling = true;
            this.resumeGame();
        };

        TimingService.prototype.resumeGame = function resumeGame() {
            var _this2 = this;

            this.stepTimerHandle = setInterval(function () {
                _this2.drawScreen();
            }, this.stepInterval);
        };

        TimingService.prototype.drawScreen = function drawScreen() {
            this.steps += 1;
            var grow = this.steps % this.growInterval == 0;
            grow && this.ea.publish('grow', this.snakeService.snake.segments.length);
            this.steps % this.speedupInterval == 0 && this.speedUp();
            this.steps % this.snackInterval == 0 && this.snackService.addSnack();
            this.snakeService.step(grow);
            this.scoreService.update(this.snakeService.snake.segments.length);
        };

        TimingService.prototype.dropSnake = function dropSnake() {
            var _this3 = this;

            this.fallTimerHandle = setInterval(function () {
                _this3.snakeService.fallDown();
            }, this.dropInterval);
        };

        TimingService.prototype.speedUp = function speedUp() {
            if (this.stepInterval > this.minStepInterval) {
                this.speed += 1;
                this.clearTimedEvents();
                this.stepInterval -= this.changeStepInterval;
                this.screenService.setAnimationTime(this.stepInterval * .001);
                this.resumeGame();
                this.ea.publish('speed', this.speed);
            }
        };

        TimingService.prototype.slowDown = function slowDown() {
            if (this.stepInterval < this.maxStepInterval) {
                this.speed -= 1;
                this.clearTimedEvents();
                this.stepInterval += this.changeStepInterval;
                this.screenService.setAnimationTime(this.stepInterval * .001);
                this.resumeGame();
                this.ea.publish('speed', this.speed);
            }
        };

        TimingService.prototype.growSlower = function growSlower() {
            var _this4 = this;

            this.growInterval += 5;
            setTimeout(function () {
                _this4.growInterval -= 5;
            }, this.snackDuration);
        };

        TimingService.prototype.growHarder = function growHarder() {
            var _this5 = this;

            if (this.growInterval > this.baseGrowInterval) {
                this.growInterval -= 5;
                setTimeout(function () {
                    _this5.growInterval += 5;
                }, this.snackDuration);
            }
        };

        TimingService.prototype.multiPlyScore = function multiPlyScore() {
            var _this6 = this;

            this.scoreService.setMultiplier();
            setTimeout(function () {
                _this6.scoreService.resetMultiplier();
            }, this.snackDuration);
        };

        TimingService.prototype.mixSnacks = function mixSnacks() {
            var _this7 = this;

            this.snackService.mixSnacks();
            setTimeout(function () {
                _this7.snackService.unMixSnacks();
            }, this.snackDuration);
        };

        TimingService.prototype.clearTimedEvents = function clearTimedEvents() {
            clearInterval(this.stepTimerHandle);
            clearInterval(this.fallTimerHandle);
        };

        TimingService.prototype.pauseGame = function pauseGame() {
            if (this.crawling) {
                this.pause = !this.pause;
                if (this.pause) {
                    this.clearTimedEvents();
                } else {
                    this.resumeGame();
                }
            }
        };

        TimingService.prototype.restart = function restart() {
            if (!this.pause) {
                this.clearTimedEvents();
                this.startGame();
            }
        };

        TimingService.prototype.setSubscribers = function setSubscribers() {
            var _this8 = this;

            var direction = 0;
            this.ea.subscribe('keyPressed', function (response) {
                switch (response) {
                    case 'Enter':
                        _this8.ea.publish('start');
                        break;
                    case ' ':
                        _this8.ea.publish('pause');
                        break;
                }
            });
            this.ea.subscribe('die', function (response) {
                _this8.clearTimedEvents();
                _this8.dropSnake();
            });
            this.ea.subscribe('start', function (response) {
                _this8.restart();
            });
            this.ea.subscribe('pause', function (response) {
                _this8.pauseGame();
            });
            this.ea.subscribe('gameOver', function (response) {
                _this8.clearTimedEvents();
            });
            this.ea.subscribe('snack', function (response) {
                var method = response.split(':')[0].toLowerCase();
                _this8.methods[method]();
            });
        };

        TimingService.prototype.resetIntervals = function resetIntervals() {
            this.stepInterval = this.maxStepInterval;
            this.screenService.setAnimationTime(this.stepInterval * .001);
            this.scoreInterval = this.baseSoreInterval;
            this.growInterval = this.baseGrowInterval;
            this.speedupInterval = this.baseSpeedupInterval;
            this.snackInterval = this.baseSnackInterval;
            this.speed = 1;
        };

        return TimingService;
    }()) || _class);
});
define('services/touch-service',['exports', 'aurelia-framework', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _aureliaEventAggregator) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.TouchService = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var TouchService = exports.TouchService = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = function () {
        function TouchService(eventAggregator) {
            var _this = this;

            _classCallCheck(this, TouchService);

            this.ea = eventAggregator;
            this.$area;
            this.clickAreaSize = {
                width: 1,
                height: 1,
                diagonal: 1
            };
            this.ea.subscribe('touch', function (response) {
                _this.handleTouch(response);
            });
        }

        TouchService.prototype.setAreaSize = function setAreaSize($area) {
            this.$area = $area;
            this.clickAreaSize.width = $area.width();
            this.clickAreaSize.height = $area.height();
            this.clickAreaSize.width > 0 && (this.clickAreaSize.diagonal = this.clickAreaSize.height / this.clickAreaSize.width);
        };

        TouchService.prototype.handleTouch = function handleTouch(event) {
            var clickX = void 0;
            var clickY = void 0;
            if (event.layerX) {
                clickX = event.layerX;
                clickY = event.layerY;
            } else {
                var offset = this.$area.offset();
                var touch = event.touches[0];
                clickX = touch.pageX - offset.left;
                clickY = touch.pageY - offset.top;
            }
            var direction = 'undefined';
            if (clickY <= clickX * this.clickAreaSize.diagonal) {
                if (clickY <= this.clickAreaSize.height - clickX) {
                    direction = 'ArrowUp';
                } else {
                    direction = 'ArrowRight';
                }
            } else {
                if (clickY <= this.clickAreaSize.height - clickX) {
                    direction = 'ArrowLeft';
                } else {
                    direction = 'ArrowDown';
                }
            }
            this.ea.publish('keyPressed', direction);
            return false;
        };

        return TouchService;
    }()) || _class);
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('aurelia-cookie/aurelia-cookie',["require", "exports"], function (require, exports) {
    "use strict";
    var AureliaCookie = (function () {
        function AureliaCookie() {
        }
        /**
        *
        * Get a cookie by its name
        */
        AureliaCookie.get = function (name) {
            var cookies = this.all();
            if (cookies && cookies[name]) {
                return cookies[name];
            }
            return null;
        };
        /**
        * Set a cookie
        */
        AureliaCookie.set = function (name, value, options) {
            var str = this.encode(name) + "=" + this.encode(value);
            if (value === null) {
                options.expiry = -1;
            }
            /**
            * Expiry date in hours
            */
            if (options.expiry >= 0 && !options.expires) {
                var expires = new Date();
                expires.setHours(expires.getHours() + options.expiry);
                options.expires = expires;
            }
            if (options.path) {
                str += "; path=" + options.path;
            }
            if (options.domain) {
                str += "; domain=" + options.domain;
            }
            if (options.expires) {
                str += "; expires=" + options.expires.toUTCString();
            }
            if (options.secure) {
                str += '; secure';
            }
            document.cookie = str;
        };
        /**
        * Deletes a cookie by setting its expiry date in the past
        */
        AureliaCookie.delete = function (name, domain) {
            if (domain === void 0) { domain = null; }
            var cookieString = name + " =;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            if (domain) {
                cookieString += "; domain=" + domain;
            }
            document.cookie = cookieString;
        };
        /**
        * Get all set cookies and return an array
        */
        AureliaCookie.all = function () {
            return this.parse(document.cookie);
        };
        AureliaCookie.parse = function (str) {
            var obj = {};
            var pairs = str.split(/ *; */);
            var pair;
            if (pairs[0] === '') {
                return obj;
            }
            for (var i = 0; i < pairs.length; ++i) {
                pair = pairs[i].split('=');
                obj[this.decode(pair[0])] = this.decode(pair[1]);
            }
            return obj;
        };
        AureliaCookie.encode = function (value) {
            try {
                return encodeURIComponent(value);
            }
            catch (e) {
                return null;
            }
        };
        AureliaCookie.decode = function (value) {
            try {
                return decodeURIComponent(value);
            }
            catch (e) {
                return null;
            }
        };
        return AureliaCookie;
    }());
    exports.AureliaCookie = AureliaCookie;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"reset.css\"></require>\n    <require from=\"app.css\"></require>\n    <require from=\"components/game-screen\"></require>\n    <require from=\"components/restart-overlay\"></require>\n    <require from=\"components/status\"></require>\n    <h1 class=\"gameTitle\">${message}</h1>\n    <game-screen></game-screen>\n    <restart-overlay></restart-overlay>\n    <status></status>\n</template>"; });
define('text!app.css', ['module'], function(module) { module.exports = "body {\n    position           : relative;\n    -webkit-user-select: none;\n    -moz-user-select   : none;\n    -ms-user-select    : none;\n    user-select        : none;\n    overflow           : hidden;\n    font-family        : 'Trebuchet MS', sans-serif;\n    height             : 100vh;\n    background         : #800000;\n    /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#dc143c+0,800000+100 */\n    /* Old browsers */\n    background         : url(\"./images/border.png\"), -moz-linear-gradient(top, #dc143c 0%, #800000 100%);\n    /* FF3.6-15 */\n    background         : url(\"./images/border.png\"), -webkit-linear-gradient(top, #dc143c 0%,#800000 100%);\n    /* Chrome10-25,Safari5.1-6 */\n    background         : url(\"./images/border.png\"), linear-gradient(to bottom, #dc143c 0%,#800000 100%);\n    /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */\n    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=  '#dc143c', endColorstr='#800000',GradientType=0 );\n    /* IE6-9 */\n    /* background-image   : url(\"./images/border.png\"); */\n    background-repeat  : no-repeat;\n    background-size    : 100% 100%;\n}\n\n.gameTitle {\n    position      : absolute;\n    z-index       : 2;\n    top           : 0;\n    width         : 100vw;\n    letter-spacing: 1px;\n    font-size     : 20px;\n    line-height   : 24px;\n    text-align    : center;\n    color         : whitesmoke;\n}\n"; });
define('text!components/game-screen.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"components/game-screen.css\"></require>\n    <div id=\"arena\"\n         class=\"arena\"\n         touchstart.delegate=\"touchService.handleTouch($event)\">\n        <img repeat.for=\"snack of snackService.snacks\"\n             src=\"./images/${snack.name}.png\"\n             css.bind=\"snackPosition($index)\"\n             class=\"snack\">\n        <img repeat.for=\"segment of snakeService.snake.segments\"\n             xcss=\"left: ${segment.x}px; top: ${segment.y}px;\"\n             css.bind=\"segmentCSS($index, segment.x, segment.y)\"\n             src=\"./images/${ snakeImage($index) }.png\"\n             class=\"segment\">\n    </div>\n</template>"; });
define('text!reset.css', ['module'], function(module) { module.exports = "/* http://meyerweb.com/eric/tools/css/reset/ \n   v2.0 | 20110126\n   License: none (public domain)\n*/\n\na, abbr, acronym, address, applet, article, aside, audio, b, big, blockquote, body, canvas, caption, center, cite, code, dd, del, details, dfn, div, dl, dt, em, embed, fieldset, figcaption, figure, footer, form, h1, h2, h3, h4, h5, h6, header, hgroup, html, i, iframe, img, ins, kbd, label, legend, li, mark, menu, nav, object, ol, output, p, pre, q, ruby, s, samp, section, small, span, strike, strong, sub, summary, sup, table, tbody, td, tfoot, th, thead, time, tr, tt, u, ul, var, video {\n    margin        : 0;\n    padding       : 0;\n    border        : 0;\n    font-size     : 100%;\n    font          : inherit;\n    vertical-align: baseline;\n}\n/* HTML5 display-role reset for older browsers */\narticle, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section {\n    display: block;\n}\n\nbody {\n    line-height: 1;\n}\n\nol, ul {\n    list-style: none;\n}\n\nblockquote, q {\n    quotes: none;\n}\n\nblockquote:after, blockquote:before, q:after, q:before {\n    content: '';\n    content: none;\n}\n\ntable {\n    border-collapse: collapse;\n    border-spacing : 0;\n}\n"; });
define('text!components/restart-overlay.html', ['module'], function(module) { module.exports = "<template class=\"${showOverlay || pause ? 'show' : ''}\"\n          click.delegate=\"start()\"\n          touchstart.delegate=\"start()\">\n    <require from=\"components/restart-overlay.css\"></require>\n    <h2 class=\"restart ${!pause && !firstGame ? 'show' : ''}\">Game over</h2>\n    <h2 class=\"restart ${!pause ? 'show' : ''}\">Click or tap or &lt;enter&gt; to start new game</h2>\n    <h2 class=\"paused ${pause ? 'show' : ''}\">Game paused</h2>\n    <h2 class=\"paused ${pause ? 'show' : ''}\">Press space to continue</h2>\n\n</template>"; });
define('text!components/game-screen.css', ['module'], function(module) { module.exports = "game-Screen {\n    display              : -webkit-box;\n    display              : -ms-flexbox;\n    display              : flex;\n    -webkit-box-orient   : vertical;\n    -webkit-box-direction: normal;\n    -ms-flex-direction   : column;\n    flex-direction       : column;\n    -webkit-box-pack     : center;\n    -ms-flex-pack        : center;\n    justify-content      : center;\n    -webkit-box-align    : center;\n    -ms-flex-align       : center;\n    align-items          : center;\n    width                : 100vw;\n    height               : 100vh;\n    position             : relative;\n    overflow             : hidden;\n}\n\n.arena {\n    position        : relative;\n    background-color: black;\n    pointer-events  : auto;\n    overflow        : hidden;\n}\n\n.arena img {\n    position: absolute;\n}\n\n.arena .segment {\n    -webkit-transform-origin: 50% 50%;\n    transform-origin        : 50% 50%;\n}\n\n.arena .snack {\n    width            : 24px;\n    height           : 24px;\n    -webkit-transform: translate(-4px,-4px);\n    transform        : translate(-4px,-4px);\n}\n"; });
define('text!components/status.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"components/status.css\"></require>\n    <div class=\"indicators\">\n        <img repeat.for=\"indicator of indicators\"\n             class.bind=\"indicator\"\n             src=\"./images/${ indicator }.png\">\n    </div>\n    <h2 class=\"statusLine\">\n        <span>Speed:</span><span class=\"speed\">${speed}</span>\n        <span>Length:</span><span class=\"length\">${length}</span>\n        <span>Score:</span><span class=\"score\">${score}</span>\n        <span click.delegate=\"resetHighscore()\"><span>High:</span><span class=\"high\">${highScore}</span></span>\n        <span class=\"snack\"\n              innerhtml.bind=\"snack\"></span>\n    </h2>\n</template>"; });
define('text!components/restart-overlay.css', ['module'], function(module) { module.exports = "restart-overlay {\n    position        : absolute;\n    z-index         : 10;\n    top             : 0;\n    left            : 0;\n    display         : flex;\n    flex-direction  : column;\n    justify-content : space-around;\n    align-items     : center;\n    width           : 100vw;\n    height          : 100vh;\n    background-color: rgba(0,0,0,.7);\n    opacity         : 0;\n    pointer-events  : none;\n    transition      : all .2s;\n}\n\nrestart-overlay.show {\n    opacity       : 1;\n    pointer-events: all;\n}\n\nrestart-overlay h2 {\n    font-size  : 4vmin;\n    line-height: 4vmin;\n    color      : whitesmoke;\n}\n\n.paused, .restart {\n    display: none;\n}\n\n.paused.show, .restart.show {\n    display: block;\n}\n"; });
define('text!components/status.css', ['module'], function(module) { module.exports = "status {\n    position  : absolute;\n    z-index   : 2;\n    bottom    : 0;\n    width     : 100vw;\n    text-align: center;\n}\n\n.statusLine {\n    font-size  : 18px;\n    line-height: 30px;\n    color      : wheat;\n    /* margin-left: 24px; */\n}\n\n.length, .score, .snack, .speed {\n    margin-right: 10px;\n}\n\n.indicators {\n    position: absolute;\n    left    : 24px;\n    bottom  : 4px;\n    height  : 20px;\n}\n\n.indicators img {\n    width : 20px;\n    height: auto;\n}\n\n.indicators img + img {\n    margin-left: 10px;\n}\n"; });
//# sourceMappingURL=app-bundle.js.map