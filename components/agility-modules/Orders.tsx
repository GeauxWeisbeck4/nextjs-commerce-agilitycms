import React, { FC } from 'react'

import { Container, Text } from '@components/ui'
import { Bag } from '@components/icons'
import { Module } from '@agility/nextjs'


interface Fields {
}

const Orders: Module<Fields> = ({ }) => {
	return (
		<Container>
			<Text variant="pageHeading">My Orders</Text>
			<div className="flex-1 p-24 flex flex-col justify-center items-center ">
				<span className="border border-dashed border-secondary rounded-full flex items-center justify-center w-16 h-16 p-12 bg-primary text-primary">
					<Bag className="absolute" />
				</span>
				<h2 className="pt-6 text-2xl font-bold tracking-wide text-center">
					No orders found
				</h2>
				<p className="text-accent-6 px-10 text-center pt-2">
					Orders coming soon.
				</p>
			</div>
		</Container>
	)
}

export default Orders