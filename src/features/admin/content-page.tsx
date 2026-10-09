import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from './page-header'
import { QuestList } from './quest-list'
import { QuizList } from './quiz-list'

export function ContentPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Nội dung"
        description="Câu hỏi quiz và nhiệm vụ tuần hiển thị trong ứng dụng."
      />
      <Tabs defaultValue="quiz" className="space-y-4">
        <TabsList>
          <TabsTrigger value="quiz">Câu hỏi quiz</TabsTrigger>
          <TabsTrigger value="quest">Nhiệm vụ tuần</TabsTrigger>
        </TabsList>
        <Card className="rounded-2xl p-2">
          <TabsContent value="quiz">
            <QuizList />
          </TabsContent>
          <TabsContent value="quest">
            <QuestList />
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  )
}
