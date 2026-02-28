import Home from "../../pages/home";
import Students from "../../pages/students";
import {
  FaHome,
  FaCalendarAlt,
  FaUsers,
  FaUserGraduate,
  FaUser,
  FaWolfPackBattalion,
  FaMoneyCheckAlt,
  FaMoneyBillWave,
  FaUserClock,
  FaUserAltSlash,
  FaDollarSign,
  FaCreditCard,
  FaUsersSlash,
  FaBoxOpen,
  FaRegCreditCard,
} from "react-icons/fa";
import Years from "../../pages/years";
import Groups from "../../pages/groups";
import Exams from "../../pages/exams";
import ExamQuestions from "../../pages/exams/examQuestions";
import ExamScores from "../../pages/exams/examScores";
import Lectures from "../../pages/lectures";
import Days from "../../pages/days";
import DaysQuiz from "../../pages/days/dayQuizzess";
import QuizQuestions from "../../pages/days/dayQuizzess/quizQuestions";
import QuizScores from "../../pages/days/dayQuizzess/quizScores";
import Videos from "../../pages/days/dayVideos";
import VideoQuiz from "../../pages/days/dayVideos/videoQuizzess";
import VideoQuizQuestions from "../../pages/days/dayVideos/videoQuizzess/quizQuestions";
import VideoQuizScores from "../../pages/days/dayVideos/videoQuizzess/quizScores";
import AbsentStudents from "../../pages/students/absent";
import Login from "../../pages/login";
import YearStudents from "../../pages/years/students";
import SubscriptionCards from "../../pages/SubscriptionCards";
import Subscriptions from "../../pages/years/Subscriptions";
import NotAssignedThirdGroup from "../../pages/NotAssignedThirdGroup/add/NotAssignedThirdGroup";
import YearGroups from "../../pages/years/YearGroups/index";
import GroupStudents from "../../pages/groupsStudents";
import GroupsQuizzes from "../../pages/years/YearGroups/exams";
import ExamGroupsScores from "../../pages/years/YearGroups/examScores";
import PausedStudents from "../../pages/students/Paused";
import CheckTransferMoney from "../../pages/transfer";
import TransferMoney from "../../pages/transfer/insertTransfer";
import SubscriptionCounts from "../../pages/packeges/subscriptionsCards";
import CheckCard from "../../pages/students/checkCard";
import PackSubscriptions from "../../pages/packeges/Subscriptions";
import Packages from "../../pages/packeges";
import LectureScores from "../../pages/lectures/LectureScores";
import VideoScores from "../../pages/lectures/VideoScores";
import YearsLectures from "../../pages/years/YearsLectures";
import YearsExams from "../../pages/years/YearsExams/YearsExams";
import YearsExamScore from "../../pages/years/YearsExams/YearsExamsScore";
import YearsExamQuestions from "../../pages/years/YearsExams/ExamQuestions";
import YearsExamsQuestions from "../../pages/years/YearsExams/ExamQuestions";

export const links = localStorage.getItem("moreenglishlogin")
  ? [
      {
        id: 20,
        route: "/lectures/:lecture/score",
        // icon: <FaUserGraduate />,
        hidden: true,
        component: LectureScores,
      },
      {
        id: 21,
        route: "/videos/:video/score",
        // icon: <FaUserGraduate />,
        hidden: true,
        component: VideoScores,
      },

      {
        id: 1,
        label: "Years",
        route: "/years",
        icon: <FaCalendarAlt />,
        component: Years,
        subRoutes: [
          {
            route: "",
            component: Years,
          },
          {
            route: ":id/groups",
            component: YearGroups,
          },
          {
            route: ":gen_id/lectures",
            component: YearsLectures,
          },
          {
            route: ":gen_id/exams",
            component: YearsExams,
          },
          {
            route: ":gen_id/exams/:exam_id/score",
            component: YearsExamScore,
          },
          {
            route: ":gen_id/exams/:exam_id/questions",
            component: YearsExamsQuestions,
          },

          {
            route: ":id/groups/:group/Packages",
            component: Packages,
          },
          {
            route: ":year_id/groups/:group_id/exams",
            component: GroupsQuizzes,
          },
          {
            route: ":yearId/groups/:groupID/exams/:quiz_id/score",
            component: ExamGroupsScores,
          },
          {
            route: ":id/groups/:group/exams",
            component: Exams,
          },
          {
            route: ":id/groups/:group/Packages/:pack/lectures/:lecture/days",
            component: Days,
          },
          {
            route: ":yearId/groups/:group/days/:id/AbsentStudents",
            component: AbsentStudents,
          },
          {
            route: ":id/groups/:group/Packages/:pack/lectures",
            component: Lectures,
          },

          {
            route: ":id/:YearName/students",
            component: YearStudents,
          },
          {
            route:
              ":yearId/groups/:group/Packages/:pack/lectures/:lecture/days/:day/quiz",
            component: QuizQuestions,
          },
          {
            route:
              ":yearId/groups/:group/Packages/:pack/lectures/:lecture/days/:day/quiz/:quiz",
            component: QuizQuestions,
          },
          {
            route:
              ":yearId/groups/:group/Packages/:pack/lectures/:lecture/days/:day/quiz/:quiz/score",
            component: QuizScores,
          },
          {
            route:
              ":yearId/groups/:group/Packages/:pack/lectures/:lecture/days/:day/videos",
            component: Videos,
          },
          {
            route: ":id/lectures/:id/days/:id/videos/:lecture/quiz",
            component: VideoQuiz,
          },
          {
            route: ":id/lectures/:id/days/:id/videos/:id/quiz/:id",
            component: VideoQuizQuestions,
          },
          {
            route: ":id/lectures/:id/days/:id/videos/:id/quiz/:id/score",
            component: VideoQuizScores,
          },
        ],
      },

      {
        id: 3,
        label: "Students",
        route: "/students",
        icon: <FaUserGraduate />,
        component: Students,
      },
      {
        id: 4,
        label: "Subscription Cards",
        route: "/SubscriptionCards",
        icon: <FaCreditCard />,
        component: SubscriptionCards,
      },

      {
        id: 6,
        label: "Not Assigned Groups",
        route: "/notAssignedThird",
        icon: <FaUsersSlash />,
        component: NotAssignedThirdGroup,
        subRoutes: [
          {
            route: "",
            component: NotAssignedThirdGroup,
          },
          {
            route: ":id/groupStudents",
            component: GroupStudents,
          },
        ],
      },

      {
        id: 5,
        label: "Subscriptions",
        route: ":id/Subscriptions/:type",
        icon: <FaDollarSign />,
        component: Subscriptions,
        hidden: true,
      },
      {
        id: 8,
        label: "Paused Students",
        route: "/Paused",
        icon: <FaUserAltSlash />,
        component: PausedStudents,
      },
      {
        id: 7,
        label: "Absent Students",
        route: "/Absence",
        icon: <FaUserClock />,
        component: AbsentStudents,
      },
      {
        id: 9,
        label: "Check Transfer",
        route: "/CheckTransferMoney",
        icon: <FaMoneyCheckAlt />,
        component: CheckTransferMoney,
      },
      {
        id: 10,
        label: "Transfer Money",
        route: "/TransferMoney",
        icon: <FaMoneyBillWave />,
        component: TransferMoney,
      },
      {
        id: 11,
        label: "Subscription Counts",
        route: "/SubscriptionCounts",
        icon: <FaBoxOpen />,
        component: SubscriptionCounts,
        subRoutes: [
          {
            route: "",
            component: SubscriptionCounts,
          },
          {
            route: ":pack_id/students",
            component: PackSubscriptions,
          },
        ],
      },
      {
        id: 12,
        label: "Check Card",
        route: "/checkCard",
        icon: <FaRegCreditCard />,
        component: CheckCard,
      },
    ]
  : [
      {
        id: 4,
        label: "Login",
        route: "*",
        icon: <FaUser />,
        component: Login,
        hidden: true,
      },
    ];
