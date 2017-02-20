const Point = require('./Point');
const Slice = require('./Slice');

class State {
    constructor(R, C) {
        this.R = R;
        this.C = C;
        const FREE = State.FREE;

        let cells = [];
        for (let r = this.R; r--;) {
            let row = Array(C).fill(FREE);
            cells.push(row)
        }
        this.cells = cells;

        this.cutted = [];
        this.skipped = [];
        this.all = [];
    }

    getArea() {
        return this.R * this.C - this.skipped.length
    }

    getSkippedArea() {
        return this.skipped.length
    }

    getCellState(r, c) {
        return this.cells[r][c]
    }

    setCellState(r, c, value) {
        this.cells[r][c] = value;
    }

    markSlice(slice, mark) {
        let setCellState = this.setCellState.bind(this);

        for (let point of slice) {
            this.markPoint(point, mark)
        }
    }

    cutSlice(slice) {
        this.all.push(slice);
        this.cutted.push(slice);
        this.markSlice(slice, State.USED)
    }

    uncutSlice(slice) {
        this.markSlice(slice, State.FREE)
    }

    markPoint(point, mark) {
        let setCellState = this.setCellState.bind(this);
        let {r, c} = point;
        setCellState(r, c, mark);
    }

    skipPoint(point) {
        this.all.push(point);
        this.skipped.push(point);
        this.markPoint(point, State.SKIP)
    }

    unskipPoint(point) {
        this.markPoint(point, State.FREE)
    }

    back(steps = 1) {
        for (let step = 0; step < steps; step++) {
            let item = this.all.pop();
            if (item instanceof Point) {
                this.skipped.pop();
                this.unskipPoint(item);
            } else if (item instanceof Slice) {
                this.cutted.pop();
                this.uncutSlice(item);
            }
        }
    }

    * iterate() {
        let position = new Point(0, 0);
        const R = this.R;
        const C = this.C;
        const FREE = State.FREE;
        let getCellState = this.getCellState.bind(this);

        for (let r = 0; r < R; r++) {
            for (let c = 0; c < C; c++) {
                if (getCellState(r, c) === FREE) {
                    let position = new Point(r, c);
                    yield position;
                }
            }
        }
    }

    [Symbol.iterator]() {
        return this.iterate();
    }

    toString() {
        let string = `${this.R} ${this.C}\n`;
        let cells = this.cells;
        for (let row of cells) {
            let rowString = row
                    .map(item => item.valueOf())
                    .join('') + '\n';
            string += rowString;
        }
        return string;
    }

    forSave() {
        let slices = this.cutted;
        let string = `${slices.length}\n`;
        for (let item of slices) {
            let sliceLine = item.forSave() + '\n';
            string += sliceLine;
        }

        return string;
    }
}

State.FREE = 0;
State.USED = 8;
State.SKIP = 1;

module.exports = State;