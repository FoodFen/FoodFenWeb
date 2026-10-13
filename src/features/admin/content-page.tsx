import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/page-header'
import { QuestList } from './quest-list'
import { QuizList } from './quiz-list'

export function ContentPage() {
  const { t } = useTranslation('admin')
  return (
    <div className="space-y-6">
      <PageHeader title={t('content.title')} description={t('content.description')} />
      <Tabs defaultValue="quiz" className="space-y-4">
        <TabsList>
          <TabsTrigger value="quiz">{t('content.tabs.quiz')}</TabsTrigger>
          <TabsTrigger value="quest">{t('content.tabs.quest')}</TabsTrigger>
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
