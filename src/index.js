import React from 'react'
import dom from 'react-dom'

import './index.css'


let component = React.Component


function Cell(props) {
    let style = {
        color: props.winGrid ? 'chartreuse' : '',
    }


    let className = 'cell '

    className += props.active ? 'active ' : ''
    className += props.chose ? 'chose ' : ''

    return (
        <div className={className}
             style={style}
             onClick={() => {
                 props.onClick()
             }}
        >
            {props.value}
        </div>
    )
}


class Cells extends component {
    render() {
        return (
            <div className={'cells'}>
                {
                    this.props.list.map((v, i) => {
                        let x = (i + 1) % 3 === 0 ? 3 : (i + 1) % 3
                        let y = Math.round(Math.ceil((i + 1) / 3))

                        // console.log('winCoors2  ', this.props.winCoors);
                        let winGrid = false
                        if (this.props.winCoors.includes(i)) {
                            winGrid = true
                        }
                        // console.log('winGrid  ', winGrid)


                        return (
                            <Cell chose={this.props.choseId === i} active={this.props.activeId === i} winGrid={winGrid}
                                  key={i}
                                  value={v}
                                  onClick={() => {
                                      return this.props.onClick(i, [x, y])
                                  }}/>
                        )
                    })
                }
            </div>
        )
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
    // let w;
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i]
        let a1 = squares[a]
        let b1 = squares[b]
        let c1 = squares[c]
        // console.log([a1, b1, c1])
        if (a1 && ((a1 === b1) && (a1 === c1))) {
            return {
                winner: a1,
                winCoors: [a, b, c]
            }
        }
    }
}


class Game extends component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                list: Array(9).fill(null),
                activeId: '',
                coors: []
            }],
            nextX: true,
            stepN: 0,
        }
    }

    handleClick(i, coors) {
        // console.log(i)
        let {history, nextX} = this.state
        history = history.slice(0, this.state.stepN + 1)
        // console.log('history.length  ', history.length);
        let list = history[history.length - 1].list.slice()
        calculateWinner(list)

        //如果此格已选择，或者已分出胜负
        if (list[i] || calculateWinner(list)) {
            return
        }

        history.push({list, coors, activeId: i})
        // console.log(history)

        list[i] = nextX ? 'X' : 'O'
        this.setState({
            nextX: !nextX,
            history,
            stepN: history.length - 1
        })
        // console.log(this.state)
    }

    jumpTo(i) {
        this.setState({
            // history,
            nextX: !(i % 2),
            stepN: i
        })
    }

    render() {
        let nextTip
        let steps
        let history = this.state.history
        let current = history[history.length - 1]
        let list = current.list.slice()
        // console.log(list);
        let {winner, winCoors} = calculateWinner(list) || {}


        nextTip = winner ? `赢家： ${winner}` : (list.filter(e => e).length === list.length ? '平局' : `下一步： ${this.state.nextX ? 'X' : 'O'}`)


        steps = history.map((e, i) => {
            let [x, y] = e.coors

            let className = ''
            className += i === history.length - 1 ? 'step-active  ' : ''
            className += i === this.state.stepN ? 'step-chose  ' : ''


            return i === 0 ? '' : (
                <li key={i}>
                    <button className={className} onClick={() => {
                        this.jumpTo(i)
                    }}>{(i === history.length - 1 ? `当前步： ` : `返回到此步：`) + ` [ ${x} , ${y} ]`}</button>
                </li>
            )
        })

        let Buttons = () => {
            let stepN = this.state.stepN
            let l = history.length


            // console.log(stepN, l)

            let prev = <button disabled={l === 1 || stepN === 0} onClick={() => {
                this.jumpTo(stepN - 1)
            }}>{'<<上'}</button>

            let next = <button disabled={stepN === l - 1} onClick={() => {
                this.jumpTo(stepN + 1)
            }}>{'下>>'}</button>

            let btnStyle = {
                // textAlign: 'center'
            }

            return (
                <div style={btnStyle}>
                    {prev}
                    &emsp;
                    {next}
                </div>
            )
        }

        // console.log('winCoors  ', winCoors);
        // console.log(this.state.history[this.state.stepN].activeId, current.activeId)

        return (
            <div className={'game'}>
                <Cells choseId={this.state.history[this.state.stepN].activeId} activeId={current.activeId}
                       winCoors={winCoors || []} list={list}
                       onClick={(i, coors) => this.handleClick(i, coors)}/>
                <div className={'info'}>
                    <p className={'next-tip'}>{nextTip}</p>
                    <Buttons/>
                    <ol className={'steps'}>
                        {steps}
                    </ol>
                </div>
            </div>
        )
    }
}


dom.render(
    <Game/>,
    document.querySelector('#root')
)



