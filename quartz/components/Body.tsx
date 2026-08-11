// @ts-ignore
import clipboardScript from "./scripts/clipboard.inline"
// @ts-ignore
import paperRatingScript from "./scripts/paperRating.inline"
import clipboardStyle from "./styles/clipboard.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { concatenateResources } from "../util/resources"

const Body: QuartzComponent = ({ children }: QuartzComponentProps) => {
  return <div id="quartz-body">{children}</div>
}

Body.afterDOMLoaded = concatenateResources(clipboardScript, paperRatingScript)
Body.css = clipboardStyle

export default (() => Body) satisfies QuartzComponentConstructor
