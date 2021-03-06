import cn from 'classnames'
import React, { FC } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { CommerceProvider } from '@framework'
import { useUI } from '@components/ui/context'
import type { Page } from '@commerce/types/page'
import { Navbar, Footer } from '@components/common'
import type { Category } from '@commerce/types/site'
import ShippingView from '@components/checkout/ShippingView'
import CartSidebarView from '@components/cart/CartSidebarView'
import { useAcceptCookies } from '@lib/hooks/useAcceptCookies'
import { Sidebar, Button, Modal, LoadingDots } from '@components/ui'
import PaymentMethodView from '@components/checkout/PaymentMethodView'
import CheckoutSidebarView from '@components/checkout/CheckoutSidebarView'
import { handlePreview } from "@agility/nextjs";

import LoginView from '@components/auth/LoginView'
import s from './Layout.module.css'
import LoadingWidget from '@components/agility-common/LoadingWidget'
import PreviewBar from '@components/agility-common/PreviewBar'

const Loading = () => (
	<div className="w-80 h-80 flex items-center text-center justify-center p-3">
		<LoadingDots />
	</div>
)

const dynamicProps = {
	loading: () => <Loading />,
}

const SignUpView = dynamic(
	() => import('@components/auth/SignUpView'),
	dynamicProps
)

const ForgotPassword = dynamic(
	() => import('@components/auth/ForgotPassword'),
	dynamicProps
)

const FeatureBar = dynamic(
	() => import('@components/common/FeatureBar'),
	dynamicProps
)

interface Props {
	pageProps: {
		pages?: Page[]
		categories: Category[],
		agilityProps: any
	}
}

const ModalView: FC<{ modalView: string; closeModal(): any }> = ({
	modalView,
	closeModal,
}) => {
	return (
		<Modal onClose={closeModal}>
			{modalView === 'LOGIN_VIEW' && <LoginView />}
			{modalView === 'SIGNUP_VIEW' && <SignUpView />}
			{modalView === 'FORGOT_VIEW' && <ForgotPassword />}
		</Modal>
	)
}

const ModalUI: FC = () => {
	const { displayModal, closeModal, modalView } = useUI()
	return displayModal ? (
		<ModalView modalView={modalView} closeModal={closeModal} />
	) : null
}

const SidebarView: FC<{ sidebarView: string; closeSidebar(): any }> = ({
	sidebarView,
	closeSidebar,
}) => {
	return (
		<Sidebar onClose={closeSidebar}>
			{sidebarView === 'CART_VIEW' && <CartSidebarView />}
			{sidebarView === 'CHECKOUT_VIEW' && <CheckoutSidebarView />}
			{sidebarView === 'PAYMENT_VIEW' && <PaymentMethodView />}
			{sidebarView === 'SHIPPING_VIEW' && <ShippingView />}
		</Sidebar>
	)
}

const SidebarUI: FC = () => {
	const { displaySidebar, closeSidebar, sidebarView } = useUI()
	return displaySidebar ? (
		<SidebarView sidebarView={sidebarView} closeSidebar={closeSidebar} />
	) : null
}

const Layout: FC<Props> = (props) => {

	// set up handle preview
	const isPreviewLoading = handlePreview();

	const {
		children,
		pageProps: { agilityProps, ...pageProps },
	} = props


	const { acceptedCookies, onAcceptCookies } = useAcceptCookies()
	const { locale = 'en-US' } = useRouter()

	const categories = agilityProps?.globalData?.sitedata?.categoryLinks || []

	const navBarlinks = categories.slice(0, 2).map((c: any) => ({
		label: c.name,
		href: `/search/${c.slug}`,
	}))

	return (
		<CommerceProvider locale={locale}>

			<div className={cn(s.root)}>

				{isPreviewLoading &&
					<LoadingWidget message="Loading Preview Mode" />
				}
				{!isPreviewLoading &&
					<>
						{ agilityProps &&
							<PreviewBar isDevelopmentMode={agilityProps.isDevelopmentMode} isPreview={agilityProps.isPreview}/>
						}
						<Navbar links={navBarlinks} agilityProps={agilityProps} />
						<main className="fit">{children}</main>
						<Footer pages={pageProps.pages} agilityProps={agilityProps} />
						<ModalUI />
						<SidebarUI />
						<FeatureBar
							title="This site uses cookies to improve your experience. By clicking, you agree to our Privacy Policy."
							hide={acceptedCookies}
							action={
								<Button className="mx-5" onClick={() => onAcceptCookies()}>
									Accept cookies
								</Button>
							}
						/>
					</>
				}
			</div>
		</CommerceProvider>
	)
}

export default Layout
