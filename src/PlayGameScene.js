import Phaser from 'phaser'
import {
    SCENE_PLAY_GAME,
    SOUND_BGM_OFFICE,
    SOUND_EFFTCT_CLICK,
    SOUND_EFFTCT_ERROR,
    SOUND_EFFTCT_POINT,
    SCENE_GAME_OVER_FAIL,
    SCENE_GAME_OVER_CLEAR,
    TIME_EVENT
} from './constant'
import { RandomEvent } from './RandomEvent'
import { PointEvent } from './PointEvent'
import { Calender } from './Calender'
class PlayGameScene extends Phaser.Scene {
    constructor () {
        super(SCENE_PLAY_GAME)
    }

    init (data) {
        this.playerName = data
    }

    preload () {
        this.load.bitmapFont('atari', 'fonts/atari-classic.png', './fonts/atari-classic.xml')
        this.load.bitmapFont('visitor', 'fonts/visitor2.png', './fonts/visitor2.xml')
        this.load.audio(SOUND_EFFTCT_CLICK, 'sounds/mixkit-fast-double-click-on-mouse-275.wav')
        this.load.audio(SOUND_EFFTCT_ERROR, 'sounds/mixkit-click-error-1110.wav')
        this.load.audio(SOUND_EFFTCT_POINT, 'sounds/mixkit-video-game-mystery-alert-234.wav')
        this.load.audio(SOUND_BGM_OFFICE, 'sounds/mixkit-office-ambience-447.wav')
        this.load.image('service-task', 'images/service-task.png')
        this.load.image('score', 'images/score.png')
        this.load.image('close-button', 'images/close-button.png')
        this.load.image('alarm', 'images/bell.png')
        this.load.image('alarm1', 'images/bell1.png')
        this.load.image('alarm2', 'images/bell2.png')
        this.load.image('alarm-message', 'images/alarm-message.png')
        this.load.image('reminder', 'images/reminder.png')
        this.load.image('history', 'images/history.png')
        this.load.image('history-message', 'images/history-message.png')
        this.load.image('check-box', 'images/check-box.png')
        this.load.image('checked-box', 'images/checked-box.png')
        this.load.image('working1', 'images/working1.png')
        this.load.image('working2', 'images/working2.png')
        this.load.image('button-white', 'images/plain-box.png')
        this.load.image('alert-pop-up', 'images/alertpopup.png')
        this.load.image('alarm-box', 'images/alarm-box.png')
        this.load.image('text-box-pop-up', 'images/text-box-pop-up.png')
        this.load.image('result-box', 'images/result-box.png')
        this.load.image('letter', 'images/letter.png')

        this.load.json('actions', 'actions.json')
        this.load.path = 'images/action/'
        this.load.image('storage', 'storage.png')
        this.load.image('monitor', 'monitor.png')
        this.load.image('database', 'database.png')
        this.load.image('loadbalancing', 'loadbalancing.png')
        this.load.image('event', 'event.png')
        this.load.image('server', 'server.png')
        this.load.image('network', 'network.png')
        this.load.image('security', 'security.png')
    }

    create () {
        const music = this.sound.add(SOUND_BGM_OFFICE)
        music.setLoop(true)
        music.play()

        this.add.bitmapText(670, 580, 'atari', 'HACKATHON').setOrigin(0.5).setScale(0.2)

        /** Play main animation */
        this.anims.create({
            key: 'working',
            frames: [
                { key: 'working1' },
                { key: 'working2', duration: 200 }
            ],
            frameRate: 8,
            repeat: -1
        })

        this.add.sprite(30, 20, 'button-white').setOrigin(0).setScale(0.09).setInteractive()
        this.add.bitmapText(40, 36, 'visitor', this.playerName).setOrigin(0).setScale(0.14)
        this.add.sprite(280, 300, 'working1').play('working').setScale(0.28)
        this.add.sprite(400, 30, 'score').setScale(0.3)

        this.bellAnimation = this.anims.create({
            key: 'alarming',
            frames: [
                { key: 'alarm' },
                { key: 'alarm1' },
                { key: 'alarm' },
                { key: 'alarm2', duration: 200 }
            ],
            frameRate: 8,
            repeat: -1
        })
        this.bellAnimation.pause()

        const alarm = this.add.sprite(530, 45, 'alarm').play('alarming').setOrigin(0.5).setScale(0.1).setInteractive()

        // const alarm = this.add.sprite(530, 45, 'alarm').setOrigin(0.5).setScale(0.1).setInteractive()
        alarm.on('pointerup', this.onOpenAlarmEvent, this)

        // history
        this.pointEvent = this.scene.add('point-event', PointEvent, true)
        const history = this.add.sprite(270, 45, 'history').setOrigin(0.5).setScale(0.11).setInteractive()
        history.on('pointerup', this.onOpenHistoryEvent, this)

        // calender
        this.calenderEvent = this.scene.add('calender-event', Calender, true)

        // random event
        this.randomEvent = this.scene.add('random-event', RandomEvent, true)
        this.eventIndex = 0

        // left
        const server = this.add.sprite(63, 140, 'server').setOrigin(0.5).setScale(0.1).setInteractive()
        server.name = 'server'
        this.add.bitmapText(60, 180, 'atari', 'SERVER').setOrigin(0.5).setScale(0.17)
        const database = this.add.sprite(60, 240, 'database').setOrigin(0.5).setScale(0.12).setInteractive()
        database.name = 'database'
        this.add.bitmapText(60, 280, 'atari', 'DATABASE').setOrigin(0.5).setScale(0.17)
        const security = this.add.sprite(60, 340, 'security').setOrigin(0.5).setScale(0.08).setInteractive()
        security.name = 'security'
        this.add.bitmapText(60, 380, 'atari', 'SECURITY').setOrigin(0.5).setScale(0.17)
        const autoscaling = this.add.sprite(60, 440, 'loadbalancing').setOrigin(0.5).setScale(0.1).setInteractive()
        autoscaling.name = 'autoscaling'
        this.add.bitmapText(60, 480, 'atari', 'SCALING').setOrigin(0.5).setScale(0.17)

        // right
        const monitor = this.add.sprite(750, 140, 'monitor').setOrigin(0.5).setScale(0.1).setInteractive()
        monitor.name = 'monitor'
        this.add.bitmapText(750, 180, 'atari', 'MONITOR').setOrigin(0.5).setScale(0.17)
        const network = this.add.sprite(750, 240, 'network').setOrigin(0.5).setScale(0.1).setInteractive()
        network.name = 'network'
        this.add.bitmapText(750, 280, 'atari', 'NETWORK').setOrigin(0.5).setScale(0.17)
        const storage = this.add.sprite(750, 340, 'storage').setOrigin(0.5).setScale(0.1).setInteractive()
        storage.name = 'storage'
        this.add.bitmapText(750, 380, 'atari', 'STORAGE').setOrigin(0.5).setScale(0.17)
        const event = this.add.sprite(750, 440, 'event').setOrigin(0.5).setScale(0.1).setInteractive()
        event.name = 'event'
        this.add.bitmapText(750, 480, 'atari', 'EVENT').setOrigin(0.5).setScale(0.17)
        this.point = this.add.bitmapText(400, 45, 'atari', this.pointEvent.point).setOrigin(0.5).setScale(0.6)

        /** music */
        this.music = {}
        this.music[SOUND_EFFTCT_CLICK] = this.sound.add(SOUND_EFFTCT_CLICK)
        this.music[SOUND_EFFTCT_ERROR] = this.sound.add(SOUND_EFFTCT_ERROR)
        this.music[SOUND_EFFTCT_POINT] = this.sound.add(SOUND_EFFTCT_POINT)

        /** add event */
        const actions = [server, database, security, autoscaling, monitor, network, storage, event]
        actions.forEach(service => service.on('pointerup', this.onOpenTaskEvent.bind(this, service), this))
        this.actions = this.cache.json.get('actions')
        this.alertFlag = false
        this.openModal = false
        this.tasks = {}
        this.alarmHistory = []
        this.actionHistory = []
        this.checkedBox = []
        this.defenseActions = []
        this.reportGroup = []
        this.startFlag = false
        this.dueDate = null
    }

    update () {
        this.alarmHistory = this.randomEvent.getHistory()
        if (this.eventIndex !== this.calenderEvent.getEventIndex()) {
            this.eventIndex = this.calenderEvent.getEventIndex()
            this.pointEvent.setAlarmItem(this.alarmHistory[this.eventIndex - 1], this.eventIndex - 1)

            if (!this.startFlag) {
                this.startFlag = true
                this.alertEvent()
            } else {
                this.alertReport()
            }
        }
        this.point.destroy()
        this.point = this.add.bitmapText(400, 45, 'atari', this.pointEvent.calculate()).setOrigin(0.5).setScale(0.6)
        if (this.calenderEvent.getIsEnd()) {
            this.scene.remove(TIME_EVENT)
            this.pointEvent.calculate() > 500 ? this.scene.start(SCENE_GAME_OVER_CLEAR) : this.scene.start(SCENE_GAME_OVER_FAIL)
        }
    }

    onCloseAlertReport () {
        this.music[SOUND_EFFTCT_CLICK].play()
        this.reportGroup.forEach(child => child.destroy())
        this.close.destroy()
        this.actionHistory = []
        this.alertEvent()
    }

    alertReport () {
        this.calenderEvent.pause(true)
        const currentEvent = this.alarmHistory[this.eventIndex - 1]
        this.defenseActions = currentEvent.defenseActions
        const resultbox = this.add.sprite(40, 150, 'result-box').setScale(0.37).setOrigin(0)
        const title = this.add.bitmapText(100, 195, 'visitor', 'REPORT').setOrigin(0).setScale(0.18)
        const eventTitle = this.add.text(220, 195, currentEvent.description, { font: '18px', fill: '#000' })
        this.close = this.add.sprite(680, 185, 'close-button').setOrigin(0.0).setScale(0.25).setInteractive()

        if (this.actionHistory.length) {
            this.actionHistory.forEach((value, index) => {
                const y = 255 + index * 25
                const actionId = value.id
                const okFlag = this.defenseActions.filter(v => v === actionId).length > 0
                const checkedAction = this.add.bitmapText(220, y, 'visitor', `${value.title} (${okFlag ? currentEvent.point + 'p' : '0p'})`).setOrigin(0).setScale(0.12)
                const OX = okFlag ? 'O' : 'X'
                const resultAnswer = this.add.bitmapText(640, y, 'visitor', `( ${OX} )`).setOrigin(0).setScale(0.12)
                this.reportGroup.push(checkedAction)
                this.reportGroup.push(resultAnswer)
            })
        } else {
            const noAction = this.add.bitmapText(300, 255, 'visitor', 'no action').setOrigin(0.5).setScale(0.17)
            noAction.name = 'noAction'
            this.reportGroup.push(noAction)
        }

        this.reportGroup.push(resultbox)
        this.reportGroup.push(title)
        this.reportGroup.push(eventTitle)
        this.close.on('pointerup', this.onCloseAlertReport.bind(this), this)
    }

    alertEvent () {
        this.music[SOUND_EFFTCT_ERROR].play()
        this.dueDate = this.calenderEvent.getDueDate()
        this.openModal = true
        const alertUI = this.add.sprite(50, 150, 'text-box-pop-up').setScale(0.4).setOrigin(0).setInteractive()
        const reminder = this.add.sprite(140, 240, 'reminder').setOrigin(0.5).setScale(0.18).setInteractive()
        const alertText = this.add.text(220, 200, '문제가 생겼습니다!\n\n알림 내용을 확인하시고\n\n시간 내에 적절한 조치를 취해주세요.', { font: '20px', fill: '#000' })
        this.calenderEvent.pause(true)
        this.bellAnimation.resume()
        alertUI.on('pointerup', () => {
            alertUI.destroy()
            alertText.destroy()
            reminder.destroy()
            this.openModal = false
            this.calenderEvent.start()
            this.bellAnimation.pause()
        }, this)
    }

    /** Task Modal */
    onOpenTaskEvent (service) {
        this.music[SOUND_EFFTCT_CLICK].play()
        if (this.openModal) return
        this.openModal = true
        this.calenderEvent.pause()
        this.image = this.add.sprite(400, 300, 'service-task')
        this.close = this.add.sprite(625, 115, 'close-button').setOrigin(0.0).setScale(0.3).setInteractive()
        this.taskTitle = this.add.text(150, 130, service.name, { font: '24px', fill: '#000' })
        this.tasks[service.name] = []
        this.actions.filter(item => item.service === service.name).forEach((action, index) => {
            const checked = this.actionHistory.find(item => item.id === action.id)
            const actionTitle = this.add.bitmapText(150, 200 + (index * 40), 'atari', action.title).setScale(0.3)
            const checkbox = this.add.sprite(115, 200 + (index * 40), checked ? 'checked-box' : 'check-box').setOrigin(0.0).setScale(0.15).setInteractive()
            if (!checked) checkbox.on('pointerup', this.addActionHistoryEvent.bind(this, action, index), this)
            this.checkedBox.push(checkbox)
            this.tasks[service.name].push(actionTitle)
        })

        this.close.on('pointerup', this.onCloseTaskEvent.bind(this, service), this)
    }

    addActionHistoryEvent (action, index) {
        const calculatedPoint = this.pointEvent.calculate()

        if (calculatedPoint < 30) {
            this.music[SOUND_EFFTCT_ERROR].play()
            // this.pointEvent.setActionItems(this.actionHistory)
            // this.actionHistory.pop()
            if (!this.alertFlag) {
                // this.alertClose = this.add.sprite(530, 230, 'close-button').setOrigin(0.0).setScale(0.3).setInteractive()
                if (this.alert) this.alert.destroy()
                if (this.alertClose) this.alertClose.destroy()
                if (this.alertMessage) this.alertMessage.destroy()
                this.alert = this.add.sprite(400, 300, 'alert-pop-up').setScale(0.4)
                this.alertMessage = this.add.bitmapText(395, 300, 'atari', 'YOU HAVE NOT ENOUGH POINTS \n GAME OVER').setOrigin(0.5).setScale(0.25)
                this.alertFlag = true

                this.scene.start(SCENE_GAME_OVER_FAIL)
                // this.alertClose.on('pointerup', this.onCloseAlert.bind(this), this)
            }
        } else {
            this.music[SOUND_EFFTCT_POINT].play()
            this.actionHistory.push(action)
            this.pointEvent.setActionItems(action)
            this.checkedBox[index].destroy()
            this.checkedBox[index] = this.add.sprite(113, 196.5 + (index * 40), 'checked-box').setOrigin(0.0).setScale(0.15).setInteractive()
            // this.point.destroy()
            // this.point = this.add.bitmapText(400, 45, 'atari', this.pointEvent.calculate()).setOrigin(0.5).setScale(0.6)
        }
    }

    // onCloseAlert () {
    //     this.music[SOUND_EFFTCT_CLICK].play()
    //     this.alert.destroy()
    //     this.alertClose.destroy()
    //     this.alertMessage.destroy()
    //     this.alertFlag = false
    // }

    onCloseTaskEvent (service) {
        if (this.alertFlag) return
        this.music[SOUND_EFFTCT_CLICK].play()
        this.openModal = false
        this.image.destroy()
        this.close.destroy()
        this.taskTitle.destroy()
        this.tasks[service.name].forEach(task => task.destroy())
        this.checkedBox.forEach(child => child.destroy())
        this.calenderEvent.start()
    }

    /** Alarm Modal */
    onOpenAlarmEvent () {
        this.music[SOUND_EFFTCT_CLICK].play()
        this.calenderEvent.pause(true)
        if (this.openModal) return
        this.openModal = true
        if (this.alarmDialog) this.alarmDialog.destroy()
        if (this.alarm) this.alarm.destroy()
        if (this.duedateText) this.duedateText.destroy()
        if (this.close) this.close.destroy()
        this.alarmDialog = this.add.sprite(80, 180, 'alarm-box').setOrigin(0).setScale(0.37).setInteractive()
        this.alarm = this.add.text(120, 200, '\n[알림]\n\n' + this.alarmHistory[this.eventIndex].description, { font: '20px', fill: '#fff' })
        this.duedateText = this.add.text(450, 320, '* 예상 날짜 : ' + this.dueDate, { font: '21px', fill: '#fff' })
        this.close = this.add.sprite(650, 190, 'close-button').setOrigin(0.0).setScale(0.3).setInteractive()
        this.close.on('pointerup', this.onCloseAlarmEvent, this)
    }

    onCloseAlarmEvent () {
        this.music[SOUND_EFFTCT_CLICK].play()
        this.openModal = false
        this.alarmDialog.destroy()
        this.alarm.destroy()
        this.duedateText.destroy()
        this.close.destroy()
        this.calenderEvent.start()
    }

    /** History Modal */
    onOpenHistoryEvent () {
        this.music[SOUND_EFFTCT_CLICK].play()
        if (this.openModal) return
        this.openModal = true
        this.calenderEvent.pause()
        this.image = this.add.sprite(200, 30, 'history-message').setOrigin(0.0).setScale(1.3).setInteractive()
        this.close = this.add.sprite(550, 80, 'close-button').setOrigin(0.0).setScale(0.3).setInteractive()
        this.taskTitle = this.add.text(280, 95, 'YOUR WORK HISTORY', { font: '24px', fill: '#000' })
        this.pointEvent.display()
        this.close.on('pointerup', this.onCloseHistory, this)
    }

    onCloseHistory () {
        this.music[SOUND_EFFTCT_CLICK].play()
        this.openModal = false
        this.pointEvent.hide()
        this.image.destroy()
        this.close.destroy()
        this.taskTitle.destroy()
        this.calenderEvent.start()
    }
}

export {
    PlayGameScene
}
