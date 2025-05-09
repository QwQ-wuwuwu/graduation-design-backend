
export default class SSEParse {
    private buffer: string = '';
    private currentEvent: { id?: string, event?: string, data: string } = { data: '' };

    feed(chunk: string) {
        this.buffer += chunk;

        while(this.buffer.includes('\n\n')) {
            const eventEnd = this.buffer.indexOf('\n\n');
            const eventData = this.buffer.slice(0, eventEnd);
            this.buffer = this.buffer.slice(eventEnd + 2);

            this.parseEvent(eventData);
        }
    }

    private parseEvent(rawEvent: string) {
        const lines = rawEvent.split('\n');

        lines.forEach((line, index) => {
            if (line.startsWith('event:')) {
                if (this.currentEvent.data) {
                    this.emitEvent(); // 发送上一次事件
                }
                this.currentEvent.event = line.substring(6).trim();
            } else if (line.startsWith('id:')) {
                this.currentEvent.id = line.substring(3).trim();
            } else if (line.startsWith('data:')) {
                this.currentEvent.data += line.substring(5).trim() + '\n';
            } else if (line.startsWith('')) {

            } else {
                this.currentEvent.data += line.trim() + '\n';
            }

            if (index === lines.length - 1) {
                this.emitEvent(); // 发送最后一个事件
            }
        })

        if (this.currentEvent.data) {
            this.currentEvent.data = this.currentEvent.data.trim(); // 去掉最后的换行符
        }
    }

    private emitEvent() {
        if (this.currentEvent.data) {
            if (this.onEvent) {
                this.onEvent({
                    id: this.currentEvent.id,
                    event: this.currentEvent.event,
                    data: this.currentEvent.data
                });
            }
            this.currentEvent = { data: '' };
        }
    }

    private onEvent?: (event: {
        id?: string,
        event?: string,
        data: string
    }) => void;

    on(event: 'event', cb: (event: {
        id?: string,
        event?: string,
        data: string
    }) => void) {
        this.onEvent = cb;
    }
}