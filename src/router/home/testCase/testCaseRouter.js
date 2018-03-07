import TestCaseMain from  '@/views/testCase/TestCaseMain'
import TestCase from  '@/views/testCase/TestCase'
import TestCaseDir from  '@/views/testCase/TestCaseDir'

export default {
  path: 'case',
  name: 'TestCaseMain',
  component: TestCaseMain,
  children: [

    {
      path: 'testCase/:id',
      name: 'TestCase',
      component: TestCase
    },
    {
      path: 'testCaseDir/:id',
      name: 'TestCaseDir',
      component: TestCaseDir
    }

    // {
    //   path: 'testCaseDirNew',
    //   name: 'TestCaseDirNew',
    //   component: TestCaseDirNew
    // },{
    //   path: 'testCaseNew',
    //   name: 'TestCaseNew',
    //   component: TestCaseNew
    // }


  ]
}
