import TestCaseMain from  '@/views/business/testCase/TestCaseMain'
import TestCaseNew from  '@/views/business/testCase/TestCaseNew'
import ApilnCase from  '@/views/business/testCase/ApiInCase'
import TestCaseEdit from  '@/views/business/testCase/TestCaseEdit'
import TestCaseDirNew from  '@/views/business/testCase/TestCaseDirNew'
import TestCaseDirEdit from  '@/views/business/testCase/TestCaseDirEdit'

export default {
  path: 'case',
  name: 'TestCaseMain',
  component: TestCaseMain,
  children: [
    {
      path: 'testCaseNew',
      name: 'TestCaseNew',
      component: TestCaseNew
    },
    {
      path: 'testCaseEdit/:id',
      name: 'TestCaseEdit',
      component: TestCaseEdit
    },
    {
      path: 'testCaseDirNew',
      name: 'TestCaseDirNew',
      component: TestCaseDirNew
    },
    {
      path: 'apilnCase',
      name: 'ApilnCase',
      component: ApilnCase
    },
    {
      path: 'testCaseDirEdit/:id',
      name: 'TestCaseDirEdit',
      component: TestCaseDirEdit
    }

  ]
}
