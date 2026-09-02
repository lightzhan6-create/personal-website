(() => {
    'use strict';

    const STORAGE_KEY = 'freecat-language';
    const DEFAULT_LANGUAGE = 'zh-CN';
    const EN_US_CONFIG_URL = '/i18n/en-US.json';

    const translations = {
        'zh-CN': {
            home: '首页',
            articles: '文章',
            resume: '个人履历',
            projects: '项目',
            gallery: '图库',
            videos: '视频',
            about: '关于',

            chooseLanguage: '选择语言',
            languageDescription: '请选择网站界面使用的语言。',
            currentChoice: '当前选择',

            searchPlaceholder: '搜索文章……',
            searchLabel: '搜索',
            closeSearchLabel: '关闭搜索',
            tagsLabel: '查看标签',
            themeLabel: '切换主题',

            recentUpdates: '最近更新',
            sortByUpdate: '按更新排序',

            searchGoBack: '返回',
            searchEmptyPrompt: '请在上方搜索框中输入关键词。',
            searchingFor: '正在搜索：',
            searchNoResultsTitle: '没有找到结果',
            searchNoResultsDescription: '请尝试使用其他关键词搜索',

            projectsPageTitle: '项目与解决方案',
            projectsPageDescription:
                '记录我主导和协作参与的项目，以及在实践中整理形成的解决方案。',
            projectsAll: '全部项目',
            projectsLead: '主导项目',
            projectsCollaboration: '协作项目',
            projectsSolutions: '解决方案',
            projectsEmptyTitle: '暂无项目',
            projectsEmptyDescription: '当前分类的内容正在整理中。',

            projectCategoryLead: '主导项目',
            projectCategoryCollaboration: '协作项目',
            projectCategorySolution: '解决方案',

            projectStatusDraft: '草稿',
            projectStatusPlanning: '规划中',
            projectStatusActive: '进行中',
            projectStatusCompleted: '已完成',
            projectStatusArchived: '已归档',

            projectFeatured: '精选',
            projectNoCover: '暂无项目封面',
            projectNoSummary: '暂无项目摘要',
            projectDate: '项目时间',
            projectRole: '承担角色',
            projectUnfilled: '未填写',
            projectView: '查看项目',

            projectDetailBack: '返回项目列表',
            projectDetailDate: '项目时间',
            projectDetailLocation: '项目地点',
            projectDetailRole: '承担角色',
            projectDetailUpdated: '最后更新',
            projectDetailToc: '项目目录',
            projectDetailRelated: '相关内容',
            projectDetailRelatedArticles: '相关文章',
            projectDetailRelatedVideos: '相关视频',
            projectDetailRelatedImages: '相关图片',
            projectDetailRelatedProjects: '相关项目'
        },

        'zh-TW': {
            home: '首頁',
            articles: '文章',
            resume: '個人履歷',
            projects: '專案',
            gallery: '圖庫',
            videos: '影片',
            about: '關於',

            chooseLanguage: '選擇語言',
            languageDescription: '請選擇網站介面使用的語言。',
            currentChoice: '目前選擇',

            searchPlaceholder: '搜尋文章……',
            searchLabel: '搜尋',
            closeSearchLabel: '關閉搜尋',
            tagsLabel: '查看標籤',
            themeLabel: '切換主題',

            recentUpdates: '最近更新',
            sortByUpdate: '依更新排序',

            searchGoBack: '返回',
            searchEmptyPrompt: '請在上方搜尋框中輸入關鍵字。',
            searchingFor: '正在搜尋：',
            searchNoResultsTitle: '找不到結果',
            searchNoResultsDescription: '請嘗試使用其他關鍵字搜尋',

            projectsPageTitle: '專案與解決方案',
            projectsPageDescription:
                '記錄我主導和協作參與的專案，以及在實踐中整理形成的解決方案。',
            projectsAll: '全部專案',
            projectsLead: '主導專案',
            projectsCollaboration: '協作專案',
            projectsSolutions: '解決方案',
            projectsEmptyTitle: '暫無專案',
            projectsEmptyDescription: '目前分類的內容正在整理中。',

            projectCategoryLead: '主導專案',
            projectCategoryCollaboration: '協作專案',
            projectCategorySolution: '解決方案',

            projectStatusDraft: '草稿',
            projectStatusPlanning: '規劃中',
            projectStatusActive: '進行中',
            projectStatusCompleted: '已完成',
            projectStatusArchived: '已封存',

            projectFeatured: '精選',
            projectNoCover: '暫無專案封面',
            projectNoSummary: '暫無專案摘要',
            projectDate: '專案時間',
            projectRole: '承擔角色',
            projectUnfilled: '未填寫',
            projectView: '查看專案',

            projectDetailBack: '返回專案列表',
            projectDetailDate: '專案時間',
            projectDetailLocation: '專案地點',
            projectDetailRole: '承擔角色',
            projectDetailUpdated: '最後更新',
            projectDetailToc: '專案目錄',
            projectDetailRelated: '相關內容',
            projectDetailRelatedArticles: '相關文章',
            projectDetailRelatedVideos: '相關影片',
            projectDetailRelatedImages: '相關圖片',
            projectDetailRelatedProjects: '相關專案'
        },

        'en-US': {
            home: 'Home',
            articles: 'Articles',
            resume: 'Resume',
            projects: 'Project Library',
            gallery: 'Gallery',
            videos: 'Videos',
            about: 'About',

            chooseLanguage: 'Choose a language',
            languageDescription:
                'Choose the language used by the website interface.',
            currentChoice: 'Current selection',

            searchPlaceholder: 'Search articles…',
            searchLabel: 'Search',
            closeSearchLabel: 'Close search',
            tagsLabel: 'View tags',
            themeLabel: 'Switch theme',

            recentUpdates: 'Recent Updates',
            sortByUpdate: 'Sort by last update',

            searchGoBack: 'Go Back',
            searchEmptyPrompt:
                'Enter a search term in the search box above.',
            searchingFor: 'Searching for:',
            searchNoResultsTitle: 'No results found',
            searchNoResultsDescription:
                'Try searching with different keywords',

            projectsPageTitle: 'Projects & Solutions',
            projectsPageDescription:
                'Projects I led or participated in, together with reusable solutions developed through practical experience.',
            projectsAll: 'All Projects',
            projectsLead: 'Lead Projects',
            projectsCollaboration: 'Collaborative Projects',
            projectsSolutions: 'Solutions',
            projectsEmptyTitle: 'No projects',
            projectsEmptyDescription:
                'No projects are available in this category.',

            projectCategoryLead: 'Lead Project',
            projectCategoryCollaboration: 'Collaborative Project',
            projectCategorySolution: 'Solution',

            projectStatusDraft: 'Draft',
            projectStatusPlanning: 'Planning',
            projectStatusActive: 'In Progress',
            projectStatusCompleted: 'Completed',
            projectStatusArchived: 'Archived',

            projectFeatured: 'Featured',
            projectNoCover: 'No project cover',
            projectNoSummary: 'No project summary',
            projectDate: 'Project date',
            projectRole: 'Role',
            projectUnfilled: 'Not specified',
            projectView: 'View Project',

            projectDetailBack: 'Back to Projects',
            projectDetailDate: 'Project date',
            projectDetailLocation: 'Location',
            projectDetailRole: 'Role',
            projectDetailUpdated: 'Last updated',
            projectDetailToc: 'Project contents',
            projectDetailRelated: 'Related Content',
            projectDetailRelatedArticles: 'Related Articles',
            projectDetailRelatedVideos: 'Related Videos',
            projectDetailRelatedImages: 'Related Images',
            projectDetailRelatedProjects: 'Related Projects'
        },

        'en-GB': {
            home: 'Home',
            articles: 'Articles',
            resume: 'CV',
            projects: 'Projects',
            gallery: 'Gallery',
            videos: 'Videos',
            about: 'About',

            chooseLanguage: 'Choose a language',
            languageDescription:
                'Choose the language used by the website interface.',
            currentChoice: 'Current selection',

            searchPlaceholder: 'Search articles…',
            searchLabel: 'Search',
            closeSearchLabel: 'Close search',
            tagsLabel: 'View tags',
            themeLabel: 'Switch theme',

            recentUpdates: 'Recent Updates',
            sortByUpdate: 'Sort by last update',

            searchGoBack: 'Go Back',
            searchEmptyPrompt:
                'Enter a search term in the search box above.',
            searchingFor: 'Searching for:',
            searchNoResultsTitle: 'No results found',
            searchNoResultsDescription:
                'Try searching with different keywords',

            projectsPageTitle: 'Projects & Solutions',
            projectsPageDescription:
                'Projects I led or participated in, together with reusable solutions developed through practical experience.',
            projectsAll: 'All Projects',
            projectsLead: 'Lead Projects',
            projectsCollaboration: 'Collaborative Projects',
            projectsSolutions: 'Solutions',
            projectsEmptyTitle: 'No projects',
            projectsEmptyDescription:
                'No projects are available in this category.',

            projectCategoryLead: 'Lead Project',
            projectCategoryCollaboration: 'Collaborative Project',
            projectCategorySolution: 'Solution',

            projectStatusDraft: 'Draft',
            projectStatusPlanning: 'Planning',
            projectStatusActive: 'In Progress',
            projectStatusCompleted: 'Completed',
            projectStatusArchived: 'Archived',

            projectFeatured: 'Featured',
            projectNoCover: 'No project cover',
            projectNoSummary: 'No project summary',
            projectDate: 'Project date',
            projectRole: 'Role',
            projectUnfilled: 'Not specified',
            projectView: 'View Project',

            projectDetailBack: 'Back to Projects',
            projectDetailDate: 'Project date',
            projectDetailLocation: 'Location',
            projectDetailRole: 'Role',
            projectDetailUpdated: 'Last updated',
            projectDetailToc: 'Project contents',
            projectDetailRelated: 'Related Content',
            projectDetailRelatedArticles: 'Related Articles',
            projectDetailRelatedVideos: 'Related Videos',
            projectDetailRelatedImages: 'Related Images',
            projectDetailRelatedProjects: 'Related Projects'
        },

        es: {
            home: 'Inicio',
            articles: 'Artículos',
            resume: 'Currículum',
            projects: 'Proyectos',
            gallery: 'Galería',
            videos: 'Vídeos',
            about: 'Acerca de',

            chooseLanguage: 'Elegir idioma',
            languageDescription:
                'Elige el idioma de la interfaz del sitio web.',
            currentChoice: 'Selección actual',

            searchPlaceholder: 'Buscar artículos…',
            searchLabel: 'Buscar',
            closeSearchLabel: 'Cerrar búsqueda',
            tagsLabel: 'Ver etiquetas',
            themeLabel: 'Cambiar tema',

            recentUpdates: 'Actualizaciones recientes',
            sortByUpdate: 'Ordenar por actualización',

            searchGoBack: 'Volver',
            searchEmptyPrompt:
                'Introduce un término de búsqueda en el cuadro de arriba.',
            searchingFor: 'Buscando:',
            searchNoResultsTitle: 'No se encontraron resultados',
            searchNoResultsDescription:
                'Prueba con otras palabras clave',

            projectsPageTitle: 'Proyectos y soluciones',
            projectsPageDescription:
                'Proyectos que dirigí o en los que participé, junto con soluciones reutilizables desarrolladas mediante la experiencia práctica.',
            projectsAll: 'Todos los proyectos',
            projectsLead: 'Proyectos liderados',
            projectsCollaboration: 'Proyectos colaborativos',
            projectsSolutions: 'Soluciones',
            projectsEmptyTitle: 'No hay proyectos',
            projectsEmptyDescription:
                'No hay proyectos disponibles en esta categoría.',

            projectCategoryLead: 'Proyecto liderado',
            projectCategoryCollaboration: 'Proyecto colaborativo',
            projectCategorySolution: 'Solución',

            projectStatusDraft: 'Borrador',
            projectStatusPlanning: 'Planificación',
            projectStatusActive: 'En curso',
            projectStatusCompleted: 'Completado',
            projectStatusArchived: 'Archivado',

            projectFeatured: 'Destacado',
            projectNoCover: 'Sin portada del proyecto',
            projectNoSummary: 'Sin resumen del proyecto',
            projectDate: 'Fecha del proyecto',
            projectRole: 'Función',
            projectUnfilled: 'Sin especificar',
            projectView: 'Ver proyecto',

            projectDetailBack: 'Volver a proyectos',
            projectDetailDate: 'Fecha del proyecto',
            projectDetailLocation: 'Ubicación',
            projectDetailRole: 'Función',
            projectDetailUpdated: 'Última actualización',
            projectDetailToc: 'Contenido del proyecto',
            projectDetailRelated: 'Contenido relacionado',
            projectDetailRelatedArticles: 'Artículos relacionados',
            projectDetailRelatedVideos: 'Vídeos relacionados',
            projectDetailRelatedImages: 'Imágenes relacionadas',
            projectDetailRelatedProjects: 'Proyectos relacionados'
        },

        pt: {
            home: 'Início',
            articles: 'Artigos',
            resume: 'Currículo',
            projects: 'Projetos',
            gallery: 'Galeria',
            videos: 'Vídeos',
            about: 'Sobre',

            chooseLanguage: 'Escolher idioma',
            languageDescription:
                'Escolha o idioma utilizado na interface do site.',
            currentChoice: 'Seleção atual',

            searchPlaceholder: 'Pesquisar artigos…',
            searchLabel: 'Pesquisar',
            closeSearchLabel: 'Fechar pesquisa',
            tagsLabel: 'Ver etiquetas',
            themeLabel: 'Mudar tema',

            recentUpdates: 'Atualizações recentes',
            sortByUpdate: 'Ordenar por atualização',

            searchGoBack: 'Voltar',
            searchEmptyPrompt:
                'Introduza um termo de pesquisa na caixa acima.',
            searchingFor: 'A pesquisar:',
            searchNoResultsTitle: 'Nenhum resultado encontrado',
            searchNoResultsDescription:
                'Tente pesquisar com outras palavras-chave',

            projectsPageTitle: 'Projetos e soluções',
            projectsPageDescription:
                'Projetos que liderei ou em que participei, juntamente com soluções reutilizáveis desenvolvidas através da experiência prática.',
            projectsAll: 'Todos os projetos',
            projectsLead: 'Projetos liderados',
            projectsCollaboration: 'Projetos colaborativos',
            projectsSolutions: 'Soluções',
            projectsEmptyTitle: 'Sem projetos',
            projectsEmptyDescription:
                'Não existem projetos disponíveis nesta categoria.',

            projectCategoryLead: 'Projeto liderado',
            projectCategoryCollaboration: 'Projeto colaborativo',
            projectCategorySolution: 'Solução',

            projectStatusDraft: 'Rascunho',
            projectStatusPlanning: 'Em planeamento',
            projectStatusActive: 'Em curso',
            projectStatusCompleted: 'Concluído',
            projectStatusArchived: 'Arquivado',

            projectFeatured: 'Destaque',
            projectNoCover: 'Sem capa do projeto',
            projectNoSummary: 'Sem resumo do projeto',
            projectDate: 'Data do projeto',
            projectRole: 'Função',
            projectUnfilled: 'Não especificado',
            projectView: 'Ver projeto',

            projectDetailBack: 'Voltar aos projetos',
            projectDetailDate: 'Data do projeto',
            projectDetailLocation: 'Localização',
            projectDetailRole: 'Função',
            projectDetailUpdated: 'Última atualização',
            projectDetailToc: 'Conteúdo do projeto',
            projectDetailRelated: 'Conteúdo relacionado',
            projectDetailRelatedArticles: 'Artigos relacionados',
            projectDetailRelatedVideos: 'Vídeos relacionados',
            projectDetailRelatedImages: 'Imagens relacionadas',
            projectDetailRelatedProjects: 'Projetos relacionados'
        },

        de: {
            home: 'Startseite',
            articles: 'Artikel',
            resume: 'Lebenslauf',
            projects: 'Projekte',
            gallery: 'Galerie',
            videos: 'Videos',
            about: 'Über mich',

            chooseLanguage: 'Sprache auswählen',
            languageDescription:
                'Wähle die Sprache der Website-Oberfläche.',
            currentChoice: 'Aktuelle Auswahl',

            searchPlaceholder: 'Artikel durchsuchen…',
            searchLabel: 'Suchen',
            closeSearchLabel: 'Suche schließen',
            tagsLabel: 'Tags anzeigen',
            themeLabel: 'Design wechseln',

            recentUpdates: 'Neueste Aktualisierungen',
            sortByUpdate: 'Nach Aktualisierung sortieren',

            searchGoBack: 'Zurück',
            searchEmptyPrompt: 'Gib oben einen Suchbegriff ein.',
            searchingFor: 'Suche nach:',
            searchNoResultsTitle: 'Keine Ergebnisse gefunden',
            searchNoResultsDescription:
                'Versuche es mit anderen Suchbegriffen',

            projectsPageTitle: 'Projekte und Lösungen',
            projectsPageDescription:
                'Projekte, die ich geleitet oder an denen ich mitgewirkt habe, sowie wiederverwendbare Lösungen aus praktischer Erfahrung.',
            projectsAll: 'Alle Projekte',
            projectsLead: 'Geleitete Projekte',
            projectsCollaboration: 'Gemeinschaftsprojekte',
            projectsSolutions: 'Lösungen',
            projectsEmptyTitle: 'Keine Projekte',
            projectsEmptyDescription:
                'In dieser Kategorie sind keine Projekte verfügbar.',

            projectCategoryLead: 'Geleitetes Projekt',
            projectCategoryCollaboration: 'Gemeinschaftsprojekt',
            projectCategorySolution: 'Lösung',

            projectStatusDraft: 'Entwurf',
            projectStatusPlanning: 'In Planung',
            projectStatusActive: 'In Bearbeitung',
            projectStatusCompleted: 'Abgeschlossen',
            projectStatusArchived: 'Archiviert',

            projectFeatured: 'Hervorgehoben',
            projectNoCover: 'Kein Projektbild',
            projectNoSummary: 'Keine Projektzusammenfassung',
            projectDate: 'Projektdatum',
            projectRole: 'Rolle',
            projectUnfilled: 'Nicht angegeben',
            projectView: 'Projekt ansehen',

            projectDetailBack: 'Zurück zu den Projekten',
            projectDetailDate: 'Projektdatum',
            projectDetailLocation: 'Ort',
            projectDetailRole: 'Rolle',
            projectDetailUpdated: 'Zuletzt aktualisiert',
            projectDetailToc: 'Projektinhalt',
            projectDetailRelated: 'Verwandte Inhalte',
            projectDetailRelatedArticles: 'Verwandte Artikel',
            projectDetailRelatedVideos: 'Verwandte Videos',
            projectDetailRelatedImages: 'Verwandte Bilder',
            projectDetailRelatedProjects: 'Verwandte Projekte'
        },

        fr: {
            home: 'Accueil',
            articles: 'Articles',
            resume: 'CV',
            projects: 'Projets',
            gallery: 'Galerie',
            videos: 'Vidéos',
            about: 'À propos',

            chooseLanguage: 'Choisir une langue',
            languageDescription:
                'Choisissez la langue de l’interface du site.',
            currentChoice: 'Sélection actuelle',

            searchPlaceholder: 'Rechercher des articles…',
            searchLabel: 'Rechercher',
            closeSearchLabel: 'Fermer la recherche',
            tagsLabel: 'Voir les étiquettes',
            themeLabel: 'Changer de thème',

            recentUpdates: 'Mises à jour récentes',
            sortByUpdate: 'Trier par mise à jour',

            searchGoBack: 'Retour',
            searchEmptyPrompt:
                'Saisissez un terme de recherche dans le champ ci-dessus.',
            searchingFor: 'Recherche de :',
            searchNoResultsTitle: 'Aucun résultat trouvé',
            searchNoResultsDescription:
                'Essayez avec d’autres mots-clés',

            projectsPageTitle: 'Projets et solutions',
            projectsPageDescription:
                'Projets que j’ai dirigés ou auxquels j’ai participé, ainsi que des solutions réutilisables issues de l’expérience pratique.',
            projectsAll: 'Tous les projets',
            projectsLead: 'Projets dirigés',
            projectsCollaboration: 'Projets collaboratifs',
            projectsSolutions: 'Solutions',
            projectsEmptyTitle: 'Aucun projet',
            projectsEmptyDescription:
                'Aucun projet n’est disponible dans cette catégorie.',

            projectCategoryLead: 'Projet dirigé',
            projectCategoryCollaboration: 'Projet collaboratif',
            projectCategorySolution: 'Solution',

            projectStatusDraft: 'Brouillon',
            projectStatusPlanning: 'Planification',
            projectStatusActive: 'En cours',
            projectStatusCompleted: 'Terminé',
            projectStatusArchived: 'Archivé',

            projectFeatured: 'À la une',
            projectNoCover: 'Aucune image de projet',
            projectNoSummary: 'Aucun résumé de projet',
            projectDate: 'Date du projet',
            projectRole: 'Rôle',
            projectUnfilled: 'Non renseigné',
            projectView: 'Voir le projet',

            projectDetailBack: 'Retour aux projets',
            projectDetailDate: 'Date du projet',
            projectDetailLocation: 'Lieu',
            projectDetailRole: 'Rôle',
            projectDetailUpdated: 'Dernière mise à jour',
            projectDetailToc: 'Sommaire du projet',
            projectDetailRelated: 'Contenu associé',
            projectDetailRelatedArticles: 'Articles associés',
            projectDetailRelatedVideos: 'Vidéos associées',
            projectDetailRelatedImages: 'Images associées',
            projectDetailRelatedProjects: 'Projets associés'
        },

        ru: {
            home: 'Главная',
            articles: 'Статьи',
            resume: 'Резюме',
            projects: 'Проекты',
            gallery: 'Галерея',
            videos: 'Видео',
            about: 'Обо мне',

            chooseLanguage: 'Выберите язык',
            languageDescription:
                'Выберите язык интерфейса сайта.',
            currentChoice: 'Текущий выбор',

            searchPlaceholder: 'Поиск статей…',
            searchLabel: 'Поиск',
            closeSearchLabel: 'Закрыть поиск',
            tagsLabel: 'Посмотреть теги',
            themeLabel: 'Сменить тему',

            recentUpdates: 'Последние обновления',
            sortByUpdate: 'Сортировать по обновлению',

            searchGoBack: 'Назад',
            searchEmptyPrompt:
                'Введите поисковый запрос в поле выше.',
            searchingFor: 'Поиск:',
            searchNoResultsTitle: 'Ничего не найдено',
            searchNoResultsDescription:
                'Попробуйте использовать другие ключевые слова',

            projectsPageTitle: 'Проекты и решения',
            projectsPageDescription:
                'Проекты, которыми я руководил или в которых участвовал, а также решения, созданные на основе практического опыта.',
            projectsAll: 'Все проекты',
            projectsLead: 'Проекты под моим руководством',
            projectsCollaboration: 'Совместные проекты',
            projectsSolutions: 'Решения',
            projectsEmptyTitle: 'Нет проектов',
            projectsEmptyDescription:
                'В этой категории пока нет доступных проектов.',

            projectCategoryLead: 'Проект под моим руководством',
            projectCategoryCollaboration: 'Совместный проект',
            projectCategorySolution: 'Решение',

            projectStatusDraft: 'Черновик',
            projectStatusPlanning: 'Планирование',
            projectStatusActive: 'В процессе',
            projectStatusCompleted: 'Завершён',
            projectStatusArchived: 'В архиве',

            projectFeatured: 'Избранное',
            projectNoCover: 'Нет обложки проекта',
            projectNoSummary: 'Нет описания проекта',
            projectDate: 'Дата проекта',
            projectRole: 'Роль',
            projectUnfilled: 'Не указано',
            projectView: 'Открыть проект',

            projectDetailBack: 'Назад к проектам',
            projectDetailDate: 'Дата проекта',
            projectDetailLocation: 'Место',
            projectDetailRole: 'Роль',
            projectDetailUpdated: 'Последнее обновление',
            projectDetailToc: 'Содержание проекта',
            projectDetailRelated: 'Связанные материалы',
            projectDetailRelatedArticles: 'Связанные статьи',
            projectDetailRelatedVideos: 'Связанные видео',
            projectDetailRelatedImages: 'Связанные изображения',
            projectDetailRelatedProjects: 'Связанные проекты'
        }
    };

    function mergeEnglishConfig(config) {
        const current = translations['en-US'];

        if (!current || !config) {
            return;
        }

        const navigation = config.navigation || {};
        const languageSelector = config.languageSelector || {};
        const homeConfig = config.home || {};
        const searchPage = config.searchPage || {};
        const projectsConfig = config.projects || {};
        const commonConfig = config.common || {};
        const relatedContentConfig = config.relatedContent || {};

        translations['en-US'] = {
            ...current,

            home: navigation.home || current.home,
            articles: navigation.articles || current.articles,
            resume: navigation.resume || current.resume,
            projects: navigation.projects || current.projects,
            gallery: navigation.gallery || current.gallery,
            videos: navigation.videos || current.videos,
            about: navigation.about || current.about,

            chooseLanguage:
                languageSelector.title ||
                current.chooseLanguage,

            languageDescription:
                languageSelector.description ||
                current.languageDescription,

            currentChoice:
                languageSelector.currentSelection ||
                current.currentChoice,

            recentUpdates:
                homeConfig.recentUpdates ||
                current.recentUpdates,

            searchGoBack:
                searchPage.goBack ||
                current.searchGoBack,

            searchEmptyPrompt:
                searchPage.emptyPrompt ||
                current.searchEmptyPrompt,

            searchingFor:
                searchPage.searchingFor ||
                current.searchingFor,

            searchNoResultsTitle:
                searchPage.noResultsTitle ||
                current.searchNoResultsTitle,

            searchNoResultsDescription:
                searchPage.noResultsDescription ||
                current.searchNoResultsDescription,

            projectsPageTitle:
                projectsConfig.pageTitle ||
                current.projectsPageTitle,

            projectsPageDescription:
                projectsConfig.pageDescription ||
                current.projectsPageDescription,

            projectsAll:
                projectsConfig.all ||
                current.projectsAll,

            projectsLead:
                projectsConfig.lead ||
                current.projectsLead,

            projectsCollaboration:
                projectsConfig.collaboration ||
                current.projectsCollaboration,

            projectsSolutions:
                projectsConfig.solutions ||
                current.projectsSolutions,

            projectsEmptyDescription:
                projectsConfig.empty ||
                current.projectsEmptyDescription,

            projectView:
                projectsConfig.viewProject ||
                current.projectView,

            projectDetailBack:
                projectsConfig.backToList ||
                current.projectDetailBack,

            projectDetailUpdated:
                commonConfig.lastUpdated ||
                current.projectDetailUpdated,

            projectDetailRelated:
                relatedContentConfig.title ||
                current.projectDetailRelated,

            projectDetailRelatedArticles:
                relatedContentConfig.articles ||
                current.projectDetailRelatedArticles,

            projectDetailRelatedVideos:
                relatedContentConfig.videos ||
                current.projectDetailRelatedVideos,

            projectDetailRelatedImages:
                relatedContentConfig.images ||
                current.projectDetailRelatedImages,

            projectDetailRelatedProjects:
                relatedContentConfig.projects ||
                current.projectDetailRelatedProjects
        };
    }

    async function loadExternalTranslations() {
        try {
            const response = await fetch(
                EN_US_CONFIG_URL,
                {
                    cache: 'no-cache'
                }
            );

            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status}`
                );
            }

            const config = await response.json();

            mergeEnglishConfig(config);
        } catch (error) {
            console.warn(
                'Unable to load English translation config; using built-in fallback.',
                error
            );
        }
    }

    function getSavedLanguage() {
        try {
            return (
                localStorage.getItem(STORAGE_KEY) ||
                DEFAULT_LANGUAGE
            );
        } catch (error) {
            return DEFAULT_LANGUAGE;
        }
    }

    function saveLanguage(languageCode) {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                languageCode
            );
        } catch (error) {
            console.warn(
                'Unable to save language preference.',
                error
            );
        }
    }

    function getSafeLanguage(languageCode) {
        if (translations[languageCode]) {
            return languageCode;
        }

        return DEFAULT_LANGUAGE;
    }

    function setText(selector, value) {
        if (!value) {
            return;
        }

        const element = document.querySelector(selector);

        if (
            element &&
            element.textContent !== value
        ) {
            element.textContent = value;
        }
    }

    function setAllText(selector, value) {
        if (!value) {
            return;
        }

        document.querySelectorAll(selector).forEach(
            (element) => {
                if (element.textContent !== value) {
                    element.textContent = value;
                }
            }
        );
    }

    function setAttribute(selector, name, value) {
        if (!value) {
            return;
        }

        const element = document.querySelector(selector);

        if (element) {
            element.setAttribute(name, value);
        }
    }

    function setAllAttributes(selector, name, value) {
        if (!value) {
            return;
        }

        document.querySelectorAll(selector).forEach(
            (element) => {
                element.setAttribute(name, value);
            }
        );
    }

    function applyDirection(languageCode) {
        document.documentElement.lang = languageCode;
        document.documentElement.setAttribute('dir', 'ltr');

        if (document.body) {
            document.body.removeAttribute('dir');
            document.body.classList.remove('freecat-rtl');
        }
    }

    function applyNavigation(dictionary) {
        setText('[data-i18n="home"]', dictionary.home);
        setText('[data-i18n="articles"]', dictionary.articles);
        setText('[data-i18n="resume"]', dictionary.resume);
        setText('[data-i18n="projects"]', dictionary.projects);
        setText('[data-i18n="gallery"]', dictionary.gallery);
        setText('[data-i18n="videos"]', dictionary.videos);
        setText('[data-i18n="about"]', dictionary.about);
    }

    function applyLanguagePanel(
        languageCode,
        dictionary
    ) {
        setText(
            '[data-language-panel-title]',
            dictionary.chooseLanguage
        );

        setText(
            '[data-language-panel-description]',
            dictionary.languageDescription
        );

        const currentLanguageElement =
            document.querySelector(
                '[data-language-current]'
            );

        if (currentLanguageElement) {
            const selectedCard =
                document.querySelector(
                    `[data-language-code="${languageCode}"]`
                );

            const selectedName =
                selectedCard?.querySelector(
                    '[data-language-name]'
                )?.textContent?.trim() ||
                languageCode;

            currentLanguageElement.textContent =
                `${dictionary.currentChoice}: ${selectedName}`;
        }
    }

    function applyControls(dictionary) {
        const searchInput =
            document.querySelector(
                '[data-header-search-input]'
            );

        if (searchInput) {
            searchInput.placeholder =
                dictionary.searchPlaceholder;
        }

        setAllAttributes(
            '[data-search-open]',
            'aria-label',
            dictionary.searchLabel
        );

        setAllAttributes(
            '[data-search-close]',
            'aria-label',
            dictionary.closeSearchLabel
        );

        setAllAttributes(
            '[data-tags-button]',
            'aria-label',
            dictionary.tagsLabel
        );

        setAllAttributes(
            '[data-theme-toggle]',
            'aria-label',
            dictionary.themeLabel
        );
    }

    function applyProjectCardTranslations(dictionary) {
        const categoryMap = {
            lead: dictionary.projectCategoryLead,
            collaboration:
                dictionary.projectCategoryCollaboration,
            solution:
                dictionary.projectCategorySolution
        };

        const statusMap = {
            draft: dictionary.projectStatusDraft,
            planning: dictionary.projectStatusPlanning,
            active: dictionary.projectStatusActive,
            completed: dictionary.projectStatusCompleted,
            archived: dictionary.projectStatusArchived
        };

        document.querySelectorAll(
            '[data-project-category-label]'
        ).forEach((element) => {
            const category = (
                element.getAttribute(
                    'data-project-category-label'
                ) || ''
            ).trim().toLowerCase();

            element.textContent =
                categoryMap[category] ||
                category ||
                dictionary.projectUnfilled;
        });

        document.querySelectorAll(
            '[data-project-status-label]'
        ).forEach((element) => {
            const status = (
                element.getAttribute(
                    'data-project-status-label'
                ) || ''
            ).trim().toLowerCase();

            element.textContent =
                statusMap[status] ||
                status ||
                dictionary.projectUnfilled;
        });

        setAllText(
            '[data-project-featured-label]',
            dictionary.projectFeatured
        );

        setAllText(
            '[data-project-no-cover-label]',
            dictionary.projectNoCover
        );

        setAllText(
            '[data-project-no-summary-label]',
            dictionary.projectNoSummary
        );

        setAllText(
            '[data-project-date-label]',
            dictionary.projectDate
        );

        setAllText(
            '[data-project-role-label]',
            dictionary.projectRole
        );

        setAllText(
            '[data-project-unfilled-label]',
            dictionary.projectUnfilled
        );

        setAllText(
            '[data-project-view-label]',
            dictionary.projectView
        );
    }

    function applyProjectDetailTranslations(dictionary) {
        setText(
            '#project-detail-back',
            dictionary.projectDetailBack
        );

        setText(
            '#project-detail-date-label',
            dictionary.projectDetailDate
        );

        setText(
            '#project-detail-location-label',
            dictionary.projectDetailLocation
        );

        setText(
            '#project-detail-role-label',
            dictionary.projectDetailRole
        );

        setText(
            '#project-detail-updated-label',
            dictionary.projectDetailUpdated
        );

        setText(
            '#project-detail-toc-title',
            dictionary.projectDetailToc
        );

        setText(
            '#project-detail-related-title',
            dictionary.projectDetailRelated
        );

        setText(
            '#project-detail-related-articles-title',
            dictionary.projectDetailRelatedArticles
        );

        setText(
            '#project-detail-related-videos-title',
            dictionary.projectDetailRelatedVideos
        );

        setText(
            '#project-detail-related-images-title',
            dictionary.projectDetailRelatedImages
        );

        setText(
            '#project-detail-related-projects-title',
            dictionary.projectDetailRelatedProjects
        );
    }

    function updateSelectedCard(languageCode) {
        document.querySelectorAll(
            '[data-language-code]'
        ).forEach((card) => {
            const isSelected =
                card.getAttribute(
                    'data-language-code'
                ) === languageCode;

            card.classList.toggle(
                'is-selected',
                isSelected
            );

            card.setAttribute(
                'aria-selected',
                String(isSelected)
            );
        });
    }

    function applyLanguage(languageCode) {
        const safeLanguageCode =
            getSafeLanguage(languageCode);

        const dictionary =
            translations[safeLanguageCode];

        applyDirection(safeLanguageCode);
        applyNavigation(dictionary);

        applyLanguagePanel(
            safeLanguageCode,
            dictionary
        );

        applyControls(dictionary);

        setText(
            '#recent-updates-heading',
            dictionary.recentUpdates
        );

        setText(
            '#search-go-back',
            dictionary.searchGoBack
        );

        setText(
            '#search-empty-prompt',
            dictionary.searchEmptyPrompt
        );

        setText(
            '#searching-for-label',
            dictionary.searchingFor
        );

        setText(
            '#search-no-results-title',
            dictionary.searchNoResultsTitle
        );

        setText(
            '#search-no-results-description',
            dictionary.searchNoResultsDescription
        );

        setText(
            '#update-sort-label',
            dictionary.sortByUpdate
        );

        setAttribute(
            '[data-update-sort-switch]',
            'aria-label',
            dictionary.sortByUpdate
        );

        setText(
            '#projects-page-title',
            dictionary.projectsPageTitle
        );

        setText(
            '#projects-page-description',
            dictionary.projectsPageDescription
        );

        setText(
            '#projects-filter-all',
            dictionary.projectsAll
        );

        setText(
            '#projects-filter-lead',
            dictionary.projectsLead
        );

        setText(
            '#projects-filter-collaboration',
            dictionary.projectsCollaboration
        );

        setText(
            '#projects-filter-solutions',
            dictionary.projectsSolutions
        );

        setText(
            '#projects-empty-title',
            dictionary.projectsEmptyTitle
        );

        setText(
            '#projects-empty-description',
            dictionary.projectsEmptyDescription
        );

        applyProjectCardTranslations(dictionary);
        applyProjectDetailTranslations(dictionary);
        updateSelectedCard(safeLanguageCode);
        saveLanguage(safeLanguageCode);

        window.dispatchEvent(
            new CustomEvent(
                'freecat:languagechange',
                {
                    detail: {
                        language:
                            safeLanguageCode,
                        dictionary
                    }
                }
            )
        );
    }

    function closeLanguagePanel() {
        const panel =
            document.querySelector(
                '[data-language-panel]'
            );

        const toggle =
            document.querySelector(
                '[data-language-toggle]'
            );

        if (panel) {
            panel.hidden = true;
        }

        if (toggle) {
            toggle.setAttribute(
                'aria-expanded',
                'false'
            );
        }
    }

    function toggleLanguagePanel() {
        const panel =
            document.querySelector(
                '[data-language-panel]'
            );

        const toggle =
            document.querySelector(
                '[data-language-toggle]'
            );

        if (!panel || !toggle) {
            return;
        }

        const willOpen = panel.hidden;

        panel.hidden = !willOpen;

        toggle.setAttribute(
            'aria-expanded',
            String(willOpen)
        );
    }

    function bindLanguageControls() {
        const toggle =
            document.querySelector(
                '[data-language-toggle]'
            );

        const panel =
            document.querySelector(
                '[data-language-panel]'
            );

        if (toggle) {
            toggle.addEventListener(
                'click',
                (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    toggleLanguagePanel();
                }
            );
        }

        document.querySelectorAll(
            '[data-language-code]'
        ).forEach((card) => {
            card.addEventListener(
                'click',
                () => {
                    const languageCode =
                        card.getAttribute(
                            'data-language-code'
                        );

                    applyLanguage(languageCode);
                    closeLanguagePanel();
                }
            );
        });

        document.addEventListener(
            'click',
            (event) => {
                if (
                    panel &&
                    !panel.hidden &&
                    !panel.contains(event.target) &&
                    !toggle?.contains(event.target)
                ) {
                    closeLanguagePanel();
                }
            }
        );

        document.addEventListener(
            'keydown',
            (event) => {
                if (event.key === 'Escape') {
                    closeLanguagePanel();
                }
            }
        );
    }

    function observeDynamicContent() {
        if (!document.body) {
            return;
        }

        const observer = new MutationObserver(
            (mutations) => {
                const hasAddedNodes =
                    mutations.some(
                        (mutation) =>
                            mutation.addedNodes.length > 0
                    );

                if (!hasAddedNodes) {
                    return;
                }

                const languageCode =
                    getSafeLanguage(
                        getSavedLanguage()
                    );

                const dictionary =
                    translations[languageCode];

                applyProjectCardTranslations(
                    dictionary
                );

                applyProjectDetailTranslations(
                    dictionary
                );
            }
        );

        observer.observe(
            document.body,
            {
                childList: true,
                subtree: true
            }
        );
    }

    async function initialiseI18n() {
        await loadExternalTranslations();

        bindLanguageControls();
        applyLanguage(getSavedLanguage());
        observeDynamicContent();
    }

    if (
        document.readyState === 'loading'
    ) {
        document.addEventListener(
            'DOMContentLoaded',
            initialiseI18n,
            {
                once: true
            }
        );
    } else {
        initialiseI18n();
    }

    window.FreecatI18n = {
        applyLanguage,
        getSavedLanguage,
        translations
    };
})();
