import { init } from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { useEffect } from "react";
import useRoutingInstrumentation from "react-router-v6-instrumentation";

export default function useSentry() {
	const routingInstrumentation = useRoutingInstrumentation();
	useEffect(() => {
		init({
			dsn: process.env.SENTRY_DSN,
			release: process.env.SENTRY_RELEASE,
			integrations: [new BrowserTracing({ routingInstrumentation })],
			tracesSampleRate: 1,
			environment: process.env.APP_ENV,
			autoSessionTracking: false,
		});
	}, [routingInstrumentation]);
}
