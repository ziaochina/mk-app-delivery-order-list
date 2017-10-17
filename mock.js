/**
 * mock.js 提供应用截获ajax请求，为脱离后台测试使用
 * 模拟查询更改内存中mockData,并返回数据
 */

import { fetch } from 'mk-utils'
import moment from 'moment'
import utils from 'mk-utils'

const mockData = fetch.mockData

function initMockData() {
    if (!mockData.ticketTypes) {
        mockData.ticketTypes = [{
            id: 1,
            name: '专用发票'
        }, {
            id: 2,
            name: '普通发票'
        }]
    }

    if (!mockData.customers) {
        mockData.customers = [{
            id: 1,
            name: '腾讯'
        }, {
            id: 2,
            name: '阿里'
        }]
    }

    if (!mockData.deliveryOrders) {
        mockData.deliveryOrders = []
        for (let i = 0; i < 200; i++) {
            mockData.deliveryOrders.push({
                id: i,
                code: 'do20170101' + (100 + i + 1),
                ticketType: { id: 1, name: '专用发票' },
                date: `2017-${i % 11 + 1}-${i % 28 + 1}`,
                customer: { id: 1, name: '腾讯' },
                voucherNO: i % 2 == 1 ? '' : 'VO' + (10000 + i),
                receiptNumber: i % 2 == 1 ? '' : 'RE' + (10000 + i),
                amount: 100,
                priceTaxTotal: 130,
                paidAmount: i % 2 == 1 ? 80 : 100,
                unpaidAmount: i % 2 == 1 ? 20 : 0,
                isAudit: i % 3 == 0,
                memo: ''
            })
        }
    }
}

fetch.mock('/v1/deliverOrderList/init', (option) => {
    initMockData()
    var ret = query(option)
    console.log(option)
    ret.value.ticketTypes = mockData.ticketTypes
    ret.value.customers = mockData.customers
    return ret
})




fetch.mock('/v1/deliverOrderList/query', (option) => {
    initMockData()
    return query(option)
})

function query(option) {
    const { pagination, filter } = option

    var data = mockData.deliveryOrders

    if (filter) {


        var dates = filter.dates

        if (!dates || dates.length == 0 && !dates[0]) {
            if (filter.common == 'today') {
                dates = [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
            }
            else if (filter.common == 'yesterday') {
                dates = [moment().subtract(1, 'day').format('YYYY-MM-DD'), moment().subtract(1, 'day').format('YYYY-MM-DD')]
            }
            else if (filter.common == 'thisWeek') {
                dates = utils.moment.getThisWeekRange()
            }
            else if (filter.common == 'lastWeek') {
                dates = utils.moment.getLastWeekRange()
            }
            else if (filter.common == 'thisMonth') {
                dates = utils.moment.getThisMonthRange()
            }
            else if (filter.common == 'lastMonth') {
                dates = utils.moment.getLastMonthRange()
            }
            else if (filter.common == 'thisYear') {
                dates = utils.moment.getThisYearRange()
            }
        }

        if (dates && dates.length > 0 && dates[0]) {
            data = data.filter(o => moment(o.date).isBetween(dates[0], dates[1], null, '()'))
        }

        if(filter.customer){
            data = data.filter(o => o.customer && o.customer.id == filter.customer.id)            
        }

        if (filter.code)
            data = data.filter(o => o.code.indexOf(filter.code) != -1)
        /*
        if (filter.name)
            data = data.filter(o => o.name.indexOf(filter.name) != -1)
        if (filter.sex)
            data = data.filter(o => o.sex == filter.sex)
        if (filter.date) {
            data = data.filter(o => moment(o.date).isAfter(filter.dateRange[0]) && moment(o.date).isBefore(filter.dateRange[1]))
        }
        */
    }

    var unauditCount = data.filter(o => !o.isAudit).length,
        unpaidCount = data.filter(o => o.unpaidAmount > 0).length,
        paidCount = data.filter(o => o.unpaidAmount == 0).length,
        allCount = data.length

    if (filter) {
        if (filter.targetList == 'paid') {
            data = data.filter(o => o.unpaidAmount == 0)
        }
        else if (filter.targetList == 'unpaid') {
            data = data.filter(o => o.unpaidAmount > 0)
        }
        else if (filter.targetList == 'unaudit') {
            data = data.filter(o => !o.isAudit)
        }
    }

    var current = pagination.current
    var pageSize = pagination.pageSize
    var start = (current - 1) * pageSize
    var end = current * pageSize

    start = start > data.length - 1 ? 0 : start
    end = start > data.length - 1 ? pageSize : end
    current = start > data.length - 1 ? 1 : current


    var ret = {
        result: true,
        value: {
            pagination: { current, pageSize, total: data.length },
            list: []
        }
    }

    var tAmount = 0,
        tPriceTaxTotal = 0,
        tPaidAmount = 0,
        tUnpaidAmount = 0

    for (let j = start; j < end; j++) {
        if (data[j]) {
            ret.value.list.push(data[j])
            tAmount += data[j].amount ? data[j].amount : 0
            tPriceTaxTotal += data[j].priceTaxTotal ? data[j].priceTaxTotal : 0
            tPaidAmount += data[j].paidAmount ? data[j].paidAmount : 0
            tUnpaidAmount += data[j].unpaidAmount ? data[j].unpaidAmount : 0
        }
    }

    ret.value.total = {
        amount: tAmount,
        priceTaxTotal: tPriceTaxTotal,
        paidAmount: tPaidAmount,
        unpaidAmount: tUnpaidAmount,
        allCount,
        unauditCount,
        unpaidCount,
        paidCount,
    }

    return ret
}

fetch.mock('/v1/deliverOrderList/del', (option) => {
    initMockData()
    option.ids.forEach(id => {
        let index = mockData.deliveryOrders.findIndex(o => o.id == id)

        if (index || index === 0)
            mockData.deliveryOrders.splice(index, 1)
    })
    return { result: true, value: true }
})


fetch.mock('/v1/deliverOrderList/audit', (option) => {
    initMockData()
    option.ids.forEach(id => {
        let o = mockData.deliveryOrders.find(o => o.id == id)

        if (o)
            o.isAudit = true
    })
    return { result: true, value: true }
})



fetch.mock('/v1/deliverOrderList/reject', (option) => {
    initMockData()
    option.ids.forEach(id => {
        let o = mockData.deliveryOrders.find(o => o.id == id)

        if (o)
            o.isAudit = false
    })
    return { result: true, value: true }
})

