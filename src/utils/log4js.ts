import * as Log4js from 'log4js';
import * as Util from 'util';
import * as Moment from 'moment'; // 处理时间的工具
import Chalk from 'chalk';
import config from '../config/log4js';

// 日志级别
export enum LoggerLevel {
    ALL = 'ALL',
    MARK = 'MARK',
    TRACE = 'TRACE',
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    FATAL = 'FATAL',
    OFF = 'OFF',
}

// 内容跟踪类
export class ContextTrace {
    constructor(
        public readonly context: string,
        public readonly lineNumber?: number,
        public readonly columnNumber?: number,
    ) {
    }
}

Log4js.addLayout('Awesome-nest', (logConfig: any) => {
    return (logEvent: Log4js.LoggingEvent): string => {
        let moduleName: string = '';
        let position: string = '';

        // 日志组装
        const messageList: string[] = [];
        logEvent.data.forEach((value: any) => {
            if (value instanceof ContextTrace) {
                moduleName = value.context;
                // 显示触发日志的坐标（行，列）
                if (value.lineNumber && value.columnNumber) {
                    position = `${value.lineNumber}, ${value.columnNumber}`;
                }
                return;
            }

            if (typeof value !== 'string') {
                value = Util.inspect(value, false, 3, true);
            }

            messageList.push(value);
        });

        // 日志组成部分
        const messageOutput: string = messageList.join(' ');
        const positionOutput: string = position ? ` [${position}]` : '';
        const typeOutput: string = `[${logConfig.type}] ${logEvent.pid.toString()}   - `;
        const dateOutput: string = `${Moment(logEvent.startTime).format('YYYY-MM-DD HH:mm:ss')}`;
        const moduleOutput: string = moduleName ? `[${moduleName}] ` : '[LoggerService] ';
        let levelOutput: string = `[${logEvent.level}] ${messageOutput}`;

        // 根据日志级别，用不同颜色区分
        switch (logEvent.level.toString()) {
            case LoggerLevel.DEBUG:
                levelOutput = Chalk.green(levelOutput);
                break;
            case LoggerLevel.INFO:
                levelOutput = Chalk.cyan(levelOutput);
                break;
            case LoggerLevel.WARN:
                levelOutput = Chalk.yellow(levelOutput);
                break;
            case LoggerLevel.ERROR:
                levelOutput = Chalk.red(levelOutput);
                break;
            case LoggerLevel.FATAL:
                levelOutput = Chalk.hex('#DD4C35')(levelOutput);
                break;
            default:
                levelOutput = Chalk.grey(levelOutput);
                break;
        }

        return `${Chalk.green(typeOutput)}${dateOutput}  ${Chalk.yellow(moduleOutput)}${levelOutput}${positionOutput}`;
    };
});

// 注入配置
Log4js.configure(config);

// 实例化
const logger = Log4js.getLogger();
logger.level = LoggerLevel.TRACE;

export class Logger {
    static trace(args) {
        logger.trace(args);
    }

    static debug(args) {
        logger.debug(args);
    }

    static log(args) {
        logger.info(args);
    }

    static info(args) {
        logger.info(args);
    }

    static warn(args) {
        logger.warn(args);
    }

    static warning(args) {
        logger.warn(args);
    }

    static error(args) {
        logger.error(args);
    }

    static fatal(args) {
        logger.fatal(args);
    }

    static access(args) {
        const loggerCustom = Log4js.getLogger('http');
        loggerCustom.info(args);
    }
}
