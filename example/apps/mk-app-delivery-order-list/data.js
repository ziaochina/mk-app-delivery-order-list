export function getMeta() {
	return {
		name: 'root',
		component: 'Layout',
		className: 'mk-app-delivery-order-list',
		children: [{
			name: 'header',
			component: 'Layout',
			className: 'mk-app-delivery-order-list-header',
			children: [{
				name: 'right',
				component: 'Layout',
				className: 'mk-app-delivery-order-list-header-right',
				children: [{
					name: 'addSaleOrder',
					component: 'Button',
					type: 'showy',
					children: '新增销货单',
					onClick: '{{$add}}'
				}, {
					name: 'receipt',
					component: 'Button',
					type: 'bluesky',
					children: '收款',
					onClick: '{{$add}}'
				}, {
					name: 'batch',
					component: 'Dropdown',
					overlay: {
						name: 'menu',
						component: 'Menu',
						onClick: '{{$batchMenuClick}}',
						children: [{
							name: 'modify',
							component: 'Menu.Item',
							key: 'audit',
							children: '审核'
						}, {
							name: 'del',
							component: 'Menu.Item',
							key: 'del',
							children: '删除'
						}]
					},
					children: {
						name: 'internal',
						component: 'Button',
						type: 'bluesky',
						children: ['批量', {
							name: 'down',
							component: 'Icon',
							type: 'down'
						}]
					}
				}, {
					name: 'print',
					component: 'Button',
					className: 'mk-app-delivery-order-list-iconbutton',
					type: 'softly',
					iconFontFamily: 'mkicon',
					icon: 'print',
					title: '打印',
					onClick: '{{$print}}'
				}, {
					name: 'export',
					component: 'Button',
					className: 'mk-app-delivery-order-list-iconbutton',
					type: 'softly',
					iconFontFamily: 'mkicon',
					icon: 'upload',
					title: '导出',
					onClick: '{{$exp}}'
				}, {
					name: 'setting',
					component: 'Button',
					className: 'mk-app-delivery-order-list-iconbutton',
					type: 'softly',
					iconFontFamily: 'mkicon',
					icon: 'setting',
					title: '设置',
					onClick: '{{$setting}}'
				}]
			}]
		}, {
			name: 'filter',
			component: 'Layout',
			className: 'mk-app-delivery-order-list-filter',
			children: [{
				name: 'header',
				component: 'Layout',
				className: 'mk-app-delivery-order-list-filter-header',
				children: [{
					name: 'commonFilter',
					component: 'Button.Group',
					children: [{
						name: 'today',
						component: 'Button',
						children: '今天'
					}, {
						name: 'yesterday',
						component: 'Button',
						children: '昨天'
					}, {
						name: 'thisWeek',
						component: 'Button',
						children: '本周'
					}, {
						name: 'lastWeek',
						component: 'Button',
						children: '上周'
					}, {
						name: 'thisMonth',
						component: 'Button',
						children: '本月'
					}, {
						name: 'lastMonth',
						component: 'Button',
						children: '上月'
					}, {
						name: 'thisYear',
						component: 'Button',
						children: '本年'
					}]
				}, {
					name: 'showAll',
					component: 'Icon',
					type: 'down'
				}]
			}, {
				name: 'content',
				component: 'Layout',
				className: 'mk-app-delivery-order-list-filter-content',
				children: [{
					name: 'left',
					component: 'Form',
					className: 'mk-app-delivery-order-list-filter-content-left',
					children: [{
						name: 'dateItem',
						component: 'Form.Item',
						label: '日期',
						children: [{
							name: 'beginDate',
							component: 'DatePicker',
						}, {
							name: 'splitter',
							component: '::span',
							children: '-',
						}, {
							name: 'endDate',
							component: 'DatePicker',
						}]

					}]
				}, {
					name: 'right',
					component: 'Layout',
					className: 'mk-app-delivery-order-list-filter-content-right',
					children: [{
						name: 'search',
						component: 'Button'
					}]
				}]
			}]
		}, {
			name: 'tabs',
			component: 'Tabs',
			className: 'mk-app-delivery-order-list-tabs',
			type: 'card',
			activeKey: '{{data.other.tabKey}}',
			onChange: '{{$tabChange}}',
			children: [{
				name: 'all',
				component: 'Tabs.TabPane',
				key: 'all',
				tab: '全部'
			}, {
				name: 'notAudit',
				component: 'Tabs.TabPane',
				key: 'notAudit',
				tab: '未审核'
			}, {
				name: 'notPayAll',
				component: 'Tabs.TabPane',
				key: 'notAudited',
				tab: '未收完款'
			}, {
				name: 'payAll',
				component: 'Tabs.TabPane',
				key: 'payAll',
				tab: '已收款'
			}]
		}, {
			name: 'content',
			className: 'mk-app-delivery-order-list-content',
			component: 'Layout',
			children: [{
				name: 'dataGrid',
				component: 'DataGrid',
				headerHeight: 35,
				rowHeight: 35,
				enableSequence: true,
				startSequence: '{{(data.pagination.current-1)*data.pagination.pageSize + 1}}',
				rowsCount: "{{$getListRowsCount()}}",
				columns: [{
					name: 'select',
					component: 'DataGrid.Column',
					columnKey: 'select',
					width: 40,
					fixed: true,
					header: {
						name: 'header',
						component: 'DataGrid.Cell',
						children: {
							name: 'cb',
							component: 'Checkbox',
							checked: '{{$isSelectAll()}}',
							onChange: '{{$selectAll}}'
						}
					},
					cell: {
						name: 'cell',
						component: 'DataGrid.Cell',
						_power: '({rowIndex})=>rowIndex',
						children: {
							name: 'checkbox',
							component: 'Checkbox',
							checked: '{{data.list[_rowIndex].selected}}',
							onChange: "{{ (e, option) => $setField('data.list.' + _rowIndex + '.selected', e.target.checked ) }}",
						}
					}
				}, {
					name: 'oprate',
					component: 'DataGrid.Column',
					columnKey: 'oprate',
					fixed: true,
					width: 30,
					header: {
						name: 'header',
						component: 'DataGrid.Cell',
						children: ''
					},
					cell: {
						name: 'cell',
						component: 'DataGrid.Cell',
						_power: '({rowIndex})=>rowIndex',
						children: [{
							name: 'edit',
							component: 'Icon',
							showStyle: 'showy',
							type: 'edit',
							style: {
								fontSize: 18
							},
							title: 'edit',
							onClick: '{{$editRow}}'
						}]
					}
				}, {
					name: 'name',
					component: 'DataGrid.Column',
					columnKey: 'name',
					flexGrow: 1,
					width: 200,
					header: {
						name: 'header',
						component: 'DataGrid.Cell',
						children: '姓名'
					},
					cell: {
						name: 'cell',
						component: 'DataGrid.Cell',
						_power: '({rowIndex})=>rowIndex',
						children: '{{data.list[_rowIndex].name}}',
					},
				}, {
					name: 'sex',
					component: 'DataGrid.Column',
					columnKey: 'sex',
					width: 50,
					header: {
						name: 'header',
						component: 'DataGrid.Cell',
						children: '性别'
					},
					cell: {
						name: 'cell',
						component: 'DataGrid.Cell',
						_power: '({rowIndex})=>rowIndex',
						children: "{{data.list[_rowIndex].sex == 0? '男': '女'}}",
					}
				}, {
					name: 'mobile',
					component: 'DataGrid.Column',
					columnKey: 'mobile',
					flexGrow: 1,
					width: 200,
					header: {
						name: 'header',
						component: 'DataGrid.Cell',
						children: '手机'
					},
					cell: {
						name: 'cell',
						component: 'DataGrid.Cell',
						_power: '({rowIndex})=>rowIndex',
						children: '{{data.list[_rowIndex].mobile}}',
					},
				}, {
					name: 'birthday',
					component: 'DataGrid.Column',
					columnKey: 'birthday',
					flexGrow: 1,
					width: 200,
					header: {
						name: 'header',
						component: 'DataGrid.Cell',
						children: '生日'
					},
					cell: {
						name: 'cell',
						component: 'DataGrid.Cell',
						_power: '({rowIndex})=>rowIndex',
						children: '{{data.list[_rowIndex].birthday}}',
					},
				}, {
					name: 'department',
					component: 'DataGrid.Column',
					columnKey: 'department',
					flexGrow: 1,
					width: 100,
					header: {
						name: 'header',
						component: 'DataGrid.Cell',
						children: '部门'
					},
					cell: {
						name: 'cell',
						component: 'DataGrid.Cell',
						_power: '({rowIndex})=>rowIndex',
						children: '{{data.list[_rowIndex].department}}',
					},
				}, {
					name: 'address',
					component: 'DataGrid.Column',
					columnKey: 'address',
					flexGrow: 1,
					width: 200,
					header: {
						name: 'header',
						component: 'DataGrid.Cell',
						children: '地址'
					},
					cell: {
						name: 'cell',
						component: 'DataGrid.Cell',
						_power: '({rowIndex})=>rowIndex',
						children: '{{data.list[_rowIndex].address}}',
					},
				}]
			}]
		}, {
			name: 'footer',
			className: 'mk-app-delivery-order-list-footer',
			component: 'Layout',
			children: [{
				name: 'pagination',
				component: 'Pagination',
				showSizeChanger: true,
				pageSize: '{{data.pagination.pageSize}}',
				current: '{{data.pagination.current}}',
				total: '{{data.pagination.total}}',
				onChange: '{{$pageChanged}}',
				onShowSizeChange: '{{$pageChanged}}'
			}]
		}]
	}
}


export function getInitState() {
	return {
		data: {
			list: [],
			pagination: { current: 1, total: 0, pageSize: 20 },
			filter: {},
			other: {}
		}
	}
}
