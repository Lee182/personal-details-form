import React, { Component } from 'react'
import Builder from './Builder'
import {observer} from 'mobx-react'
import cp from '../../shared/copyObject.js'

@observer
export default class Section extends Component {
  constructor(props, context) {
    super(props)
  }
  handleBtnAdd(e) {
    var {store, form} = this.props
    e.preventDefault()
    store.addSectionArr(form.section_id)
  }
  handleBtnCross(e) {
    var {store, form} = this.props
    e.preventDefault()
    store.removeSectionArr(form.section_id, form.heading_remove)
  }


  render() {
    var {store, form, depth} = this.props
    let depth1 = (depth !== undefined) ? (depth + 1) : 0

    var hclass = 'f-heading-'+depth1
    var fclass = 'f-section-'+depth1
    var arr = []
    if (!form.array || form.array_parsed) {
      arr = form.inputs.map((o,i)=>{
        var k = (form.id || form.section_id2 || form.section_id)+'_'+i
        return <Builder store={store} form={o} key={k} depth={depth1} />
      })
    }

    var a
    var c1 = form.section_id && form.array && !form.array_parsed
    if (c1) {
      a = store.sections_arr[form.section_id]
      var b = a.array.heading
      var c = a.array.count
      for (var i = 0; i < c; i++) {
        var form0 = cp(form)
        form0.array_parsed = true
        form0.heading = (b) ? b.split('$').join(i+1) : false
        if (i >= a.array.n) {
          form0.heading_remove = i
        }
        form0.inputs = JSON.parse(
          JSON.stringify(form0.inputs).split('$').join(i) )
        form0.section_id2 = form0.section_id+'-'+i
        arr[i] = <Builder store={store} form={form0} key={form0.section_id2} depth={depth1}/>
      }
    }

    var btn = (c1 === true) ?
    <button className='btn-append' onClick={this.handleBtnAdd.bind(this)}>{a.array.label}</button>: null

    var h2
    if (form.heading === false) {
      h2 = null
    }
    else if (typeof form.heading === 'string' && form.heading_remove === undefined) {
      h2 = <div className={hclass}>
        <h2>{form.heading}</h2>
      </div>
    } else {
      h2 = [
        <div className={hclass}>
          <h2>{form.heading}</h2>
          <div className='flex-gap'></div>
          <button className='btn-x' onClick={this.handleBtnCross.bind(this)}>x</button>
        </div>,
      ]
    }
    var id = form.section_id2 || form.section_id
    return (<div id={id} className={fclass}>
      {h2}
      {arr}
      {btn}
    </div>)
  }

}
