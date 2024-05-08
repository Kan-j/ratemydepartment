
interface Props {
    title: string,
    value: number
}
const PerformanceCard = ({title, value}: Props) => {
  return (
    <section className="flex flex-1 flex-col items-center px-2 py-2 bg-blue-500 text-white rounded-lg">
          <p className="mb-2">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
    </section>
  )
}

export default PerformanceCard