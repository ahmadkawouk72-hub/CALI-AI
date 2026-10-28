import './styles/globals.css'
import './styles/markdown.scss'

const LocaleLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <div className="overflow-x-auto">
          <div className="w-screen h-screen min-w-[300px]">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}

export default LocaleLayout
